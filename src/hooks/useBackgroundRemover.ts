
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { removeBackground } from '@/utils/imageUtils';

export const useBackgroundRemover = (initialImage: string) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const handleRemoveBackground = async () => {
    try {
      setIsProcessing(true);
      setProgress(t('processingImage'));
      toast({
        title: t('processingImage'),
        description: t('processingImageWait'),
      });

      const img = new Image();
      img.src = initialImage;
      await new Promise((resolve) => (img.onload = resolve));

      const resultBlob = await removeBackground(img);
      const resultUrl = URL.createObjectURL(resultBlob);

      toast({
        title: t('success'),
        description: t('imageEnhanced'),
      });

      return resultUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('failedToProcess'),
      });
      return null;
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return {
    isProcessing,
    progress,
    handleRemoveBackground,
  };
};
