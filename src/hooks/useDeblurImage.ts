
import { useState } from 'react';
import { toast } from './use-toast';
import { useTranslation } from './useTranslation';
import { RunwareService, GeneratedImage } from '@/services/RunwareService';

interface UseDeblurImageProps {
  isPremium: boolean;
  onSuccess: (deblurredImageUrl: string) => void;
}

export const useDeblurImage = ({ isPremium, onSuccess }: UseDeblurImageProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const { t } = useTranslation();

  const runwareService = new RunwareService('LQjmP25xF3YWEuek4wjVVezqjwqZK0DB');

  const processImage = async (imageUrl: string) => {
    try {
      setIsProcessing(true);
      toast({
        title: t('processingImage'),
        description: t('enhancingImage')
      });

      const result = await runwareService.generateImage({
        positivePrompt: "enhance image quality, increase sharpness, reduce blur, maintain original content",
        model: "runware:100@1",
        width: 1024,
        height: 1024,
      });

      onSuccess(result.imageURL);
      
      toast({
        title: t('success'),
        description: t('imageEnhanced')
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('failedToProcess')
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeblurRequest = () => {
    if (isPremium) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          await processImage(imageUrl);
        }
      };
      input.click();
    } else {
      setShowPremiumDialog(true);
    }
  };

  return {
    isProcessing,
    showPremiumDialog,
    setShowPremiumDialog,
    handleDeblurRequest,
    processImage
  };
};
