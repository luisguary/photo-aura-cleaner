
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useWatermark } from './useWatermark';
import { useBackgroundSelection } from './useBackgroundSelection';
import { useImageProcessing } from './useImageProcessing';
import { useDialogs } from './useDialogs';

export const useImageEditor = (initialImage: string, fileName: string) => {
  const { t } = useTranslation();
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  const {
    showWatermark,
    isWatermarkDialogOpen,
    isPremiumUser,
    setIsWatermarkDialogOpen,
    handleWatermarkRemoveClick,
    handleBePremium,
  } = useWatermark();

  const {
    selectedBackground,
    customBackground,
    setSelectedBackground,
    handleCustomBackground,
  } = useBackgroundSelection();

  const {
    isProcessing,
    editedImage,
    progress,
    handleRemoveBackground,
    setEditedImage,
  } = useImageProcessing(initialImage);

  const {
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    isQualityDialogOpen,
    isAdWatchedDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setIsQualityDialogOpen,
    setIsAdWatchedDialogOpen,
  } = useDialogs();

  const handleUpscale = async (scale: number) => {
    try {
      setIsProcessing(true);
      setProgress(`Upscaling image to ${scale}x...`);

      const imageToUpscale = editedImage || initialImage;
      
      const response = await fetch(imageToUpscale);
      const imageBlob = await response.blob();
      
      const upscaledBlob = await upscaleImage(imageBlob, scale);
      
      if (upscaledBlob) {
        const upscaledUrl = URL.createObjectURL(upscaledBlob);
        setEditedImage(upscaledUrl);
        
        toast({
          title: "Done!",
          description: `Image successfully upscaled to ${scale}x`,
        });
      }
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem upscaling the image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleWatchAd = () => {
    setIsWatermarkDialogOpen(false);
    setProgress('Loading ad...');
    setIsProcessingAd(true);
    setTimeout(() => {
      setIsProcessingAd(false);
      setProgress('');
      setIsAdWatchedDialogOpen(true);
    }, 2000);
  };

  const handleAdWatched = () => {
    setIsAdWatchedDialogOpen(false);
    setShowWatermark(false);
    toast({
      title: "Thank you!",
      description: "Watermark successfully removed",
    });
  };

  const handleQualityDownload = () => {
    if (isPremiumUser) {
      handleDownload(true);
    } else {
      setIsQualityDialogOpen(true);
    }
  };

  const handleWatchAdForQuality = () => {
    setIsQualityDialogOpen(false);
    setIsProcessingAd(true);
    setProgress('Loading ad...');
    
    setTimeout(() => {
      setIsProcessingAd(false);
      setProgress('');
      handleDownload(true);
      toast({
        title: "Thank you for watching the ad!",
        description: "Your image will download in maximum quality",
      });
    }, 2000);
  };

  const handleBePremiumForQuality = () => {
    setIsQualityDialogOpen(false);
    handleBePremium();
    handleDownload(true);
    toast({
      title: "Welcome to Premium!",
      description: "You can now download all your images in maximum quality",
    });
  };

  const handleDownload = async (isHighQuality: boolean) => {
    try {
      const response = await fetch(editedImage || initialImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced_${fileName}`;
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

  const handleCropComplete = async (croppedImage: string) => {
    setEditedImage(croppedImage);
    setIsCropDialogOpen(false);
  };

  const handleResizeComplete = async (resizedImage: string) => {
    setEditedImage(resizedImage);
    setIsResizeDialogOpen(false);
  };

  const handleEditComplete = async (editedImg: string) => {
    setEditedImage(editedImg);
    setIsEditDialogOpen(false);
  };

  return {
    isProcessing,
    editedImage,
    progress,
    selectedBackground,
    customBackground,
    showWatermark,
    isWatermarkDialogOpen,
    isAdWatchedDialogOpen,
    isPremiumUser,
    isQualityDialogOpen,
    isProcessingAd,
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    setIsWatermarkDialogOpen,
    setIsQualityDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setSelectedBackground,
    handleRemoveBackground,
    handleUpscale,
    handleWatermarkRemoveClick,
    handleWatchAd,
    handleAdWatched,
    handleBePremium,
    handleQualityDownload,
    handleWatchAdForQuality,
    handleBePremiumForQuality,
    handleCustomBackground,
    handleCropComplete,
    handleResizeComplete,
    handleEditComplete,
  };
};
