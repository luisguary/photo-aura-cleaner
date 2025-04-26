
import { useState } from 'react';
import { useTranslation } from './useTranslation';
import { useUpscaleImage } from './useUpscaleImage';
import { toast } from './use-toast';

export const useScaleImage = (onImageProcessed: (url: string) => void, isPremium: boolean) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scaledImage, setScaledImage] = useState<string | null>(null);
  const { isProcessing, progress, handleUpscale } = useUpscaleImage();
  const [progressPercent, setProgressPercent] = useState(0);

  const handleFileSelected = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    startProcessing(imageUrl);
  };

  const startProcessing = async (imageUrl: string) => {
    toast({
      title: t('processingImage'),
      description: t('pleaseWait'),
    });

    const interval = setInterval(() => {
      setProgressPercent(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 500);

    try {
      const result = await handleUpscale(imageUrl, 2);
      clearInterval(interval);
      setProgressPercent(100);
      
      if (result) {
        setScaledImage(result);
        setIsResultDialogOpen(true);
      } else {
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      clearInterval(interval);
      console.error('Error processing image:', error);
      setIsErrorDialogOpen(true);
    }
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scaled-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('failedToProcess'),
      });
    }
  };

  const handleDownload = () => {
    if (!scaledImage) return;
    
    if (isPremium) {
      downloadImage(scaledImage);
      setIsResultDialogOpen(false);
    } else {
      setIsAdDialogOpen(true);
    }
  };

  const handleContinueToApp = () => {
    if (scaledImage) {
      onImageProcessed(scaledImage);
      setIsResultDialogOpen(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isResultDialogOpen,
    setIsResultDialogOpen,
    isAdDialogOpen,
    setIsAdDialogOpen,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
    selectedImage,
    scaledImage,
    isProcessing,
    progressPercent,
    handleFileSelected,
    handleDownload,
    handleContinueToApp,
  };
};
