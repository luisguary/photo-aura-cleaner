
import { useState } from 'react';
import { useBackgroundRemover } from './useBackgroundRemover';

export const useImageProcessing = (initialImage: string) => {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  
  const {
    isProcessing,
    progress,
    handleRemoveBackground: removeBackgroundHandler,
  } = useBackgroundRemover(initialImage);

  const handleRemoveBackground = async () => {
    const resultUrl = await removeBackgroundHandler();
    if (resultUrl) {
      setEditedImage(resultUrl);
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
