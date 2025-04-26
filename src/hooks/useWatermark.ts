
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export const useWatermark = () => {
  const { t } = useTranslation();
  const [showWatermark, setShowWatermark] = useState(true);
  const [isWatermarkDialogOpen, setIsWatermarkDialogOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const handleWatermarkRemoveClick = () => {
    if (isPremiumUser) {
      setShowWatermark(false);
      toast({
        title: "Premium User",
        description: "Watermark automatically removed",
      });
    } else {
      setIsWatermarkDialogOpen(true);
    }
  };

  const handleBePremium = () => {
    setIsWatermarkDialogOpen(false);
    setIsPremiumUser(true);
    setShowWatermark(false);
    toast({
      title: "Welcome to Premium!",
      description: "You are now a Premium user and won't see watermarks",
    });
  };

  return {
    showWatermark,
    isWatermarkDialogOpen,
    isPremiumUser,
    setIsWatermarkDialogOpen,
    handleWatermarkRemoveClick,
    handleBePremium,
  };
};
