
import { useState } from 'react';
import { useBackgroundRemover } from './useBackgroundRemover';
import { useInterstitialAd } from './useInterstitialAd';

export const useImageProcessing = (initialImage: string) => {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const { showInterstitial } = useInterstitialAd();
  
  const {
    isProcessing,
    progress,
    handleRemoveBackground: removeBackgroundHandler,
  } = useBackgroundRemover(initialImage);

  const handleRemoveBackground = async () => {
    const resultUrl = await removeBackgroundHandler();
    if (resultUrl) {
      setEditedImage(resultUrl);
      // Show interstitial ad after successful processing
      await showInterstitial();
    }
  };

  return {
    isProcessing,
    editedImage,
    progress,
    handleRemoveBackground,
    setEditedImage,
  };
};

