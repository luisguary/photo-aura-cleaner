
import { useState } from 'react';
import { toast } from './use-toast';

interface UseDeblurImageProps {
  isPremium: boolean;
  onSuccess: (deblurredImageUrl: string) => void;
}

export const useDeblurImage = ({ isPremium, onSuccess }: UseDeblurImageProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const processImage = async (imageUrl: string) => {
    try {
      setIsProcessing(true);
      toast({
        title: "Processing image...",
        description: "Enhancing image sharpness with AI..."
      });

      const formData = new FormData();
      formData.append('image', imageUrl);

      const response = await fetch("https://api.deepai.org/api/torch-srgan", {
        method: 'POST',
        headers: {
          'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const result = await response.json();
      onSuccess(result.output_url);
      
      toast({
        title: "Success!",
        description: "Your image has been enhanced"
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the image. Please try again."
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
