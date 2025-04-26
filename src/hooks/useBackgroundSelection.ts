
import { useState } from 'react';

export const useBackgroundSelection = () => {
  const [selectedBackground, setSelectedBackground] = useState<string>('transparent');
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  const handleCustomBackground = (imageUrl: string) => {
    setCustomBackground(imageUrl);
    setSelectedBackground('custom');
  };

  return {
    selectedBackground,
    customBackground,
    setSelectedBackground,
    handleCustomBackground,
  };
};
