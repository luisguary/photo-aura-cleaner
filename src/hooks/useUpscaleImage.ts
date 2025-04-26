
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { upscaleImage } from '@/utils/upscaleUtils';

export const useUpscaleImage = () => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');

  const handleUpscale = async (imageUrl: string, scale: number) => {
    try {
      setIsProcessing(true);
      setProgress(`Upscaling image to ${scale}x...`);

      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      
      const upscaledBlob = await upscaleImage(imageBlob, scale);
      
      if (upscaledBlob) {
        const upscaledUrl = URL.createObjectURL(upscaledBlob);
        
        toast({
          title: "Done!",
          description: `Image successfully upscaled to ${scale}x`,
        });

        return upscaledUrl;
      }
      return null;
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem upscaling the image. Please try again.",
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
    handleUpscale,
  };
};
