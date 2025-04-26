
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface UseDownloadProps {
  isPremiumUser: boolean;
  onBePremium: () => void;
}

export const useDownload = ({ isPremiumUser, onBePremium }: UseDownloadProps) => {
  const { t } = useTranslation();
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  const handleQualityDownload = (downloadFn: (quality: boolean) => void) => {
    if (isPremiumUser) {
      downloadFn(true);
    } else {
      setIsQualityDialogOpen(true);
    }
  };

  const handleWatchAdForQuality = (downloadFn: (quality: boolean) => void) => {
    setIsQualityDialogOpen(false);
    setIsProcessingAd(true);
    
    setTimeout(() => {
      setIsProcessingAd(false);
      downloadFn(true);
      toast({
        title: t('adCompletedThankYou'),
        description: t('imageEnhanced'),
      });
    }, 2000);
  };

  const handleBePremiumForQuality = (downloadFn: (quality: boolean) => void) => {
    setIsQualityDialogOpen(false);
    onBePremium();
    downloadFn(true);
    toast({
      title: t('becomePremiumUser'),
      description: t('imageEnhanced'),
    });
  };

  const handleDownload = async (imageUrl: string, fileName: string, isHighQuality: boolean) => {
    try {
      const response = await fetch(imageUrl);
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

  return {
    isQualityDialogOpen,
    isProcessingAd,
    setIsQualityDialogOpen,
    handleQualityDownload,
    handleWatchAdForQuality,
    handleBePremiumForQuality,
    handleDownload,
  };
};
