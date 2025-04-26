
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface UseImageUpscaleProps {
  onUpscale: (scale: number) => void;
  isPremium: boolean;
}

export const useImageUpscale = ({ onUpscale, isPremium }: UseImageUpscaleProps) => {
  const { t } = useTranslation();
  const [isUpscaleDialogOpen, setIsUpscaleDialogOpen] = useState(false);
  const [isUpscalePremiumDialogOpen, setIsUpscalePremiumDialogOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState<number>(2);
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  const resetUpscaleStates = useCallback(() => {
    setIsProcessingAd(false);
    setSelectedScale(2);
  }, []);

  const handleUpscaleClick = useCallback(() => {
    setIsUpscaleDialogOpen(true);
  }, []);

  const handleScaleSelect = useCallback((scale: number) => {
    setSelectedScale(scale);
    setIsUpscaleDialogOpen(false);
    
    if (isPremium) {
      onUpscale(scale);
      toast({
        title: t('upscaleImage'),
        description: `${t('upscaleAction')} ${scale}x`,
      });
    } else {
      setTimeout(() => {
        setIsUpscalePremiumDialogOpen(true);
      }, 100);
    }
  }, [isPremium, onUpscale, t]);

  const handleWatchAd = useCallback(() => {
    setIsUpscalePremiumDialogOpen(false);
    setIsProcessingAd(true);
    
    toast({
      title: t('loadingAd'),
      description: t('pleaseWait')
    });

    setTimeout(() => {
      setIsProcessingAd(false);
      onUpscale(selectedScale);
      toast({
        title: t('adCompletedThankYou'),
        description: `${t('upscaleAction')} ${selectedScale}x`,
      });
    }, 2000);
  }, [onUpscale, selectedScale, t]);

  const handleBePremium = useCallback(() => {
    setIsUpscalePremiumDialogOpen(false);
    onUpscale(selectedScale);
    toast({
      title: t('becomePremiumUser'),
      description: `${t('upscaleAction')} ${selectedScale}x`,
    });
  }, [onUpscale, selectedScale, t]);

  return {
    isUpscaleDialogOpen,
    isUpscalePremiumDialogOpen,
    isProcessingAd,
    handleUpscaleClick,
    handleScaleSelect,
    handleWatchAd,
    handleBePremium,
    setIsUpscaleDialogOpen,
    setIsUpscalePremiumDialogOpen,
    resetUpscaleStates
  };
};
