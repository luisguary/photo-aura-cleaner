
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useRewardedAd } from './useRewardedAd';

export const useWatermark = () => {
  const { t } = useTranslation();
  const [showWatermark, setShowWatermark] = useState(true);
  const [isWatermarkDialogOpen, setIsWatermarkDialogOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const { showRewardedAd, isLoading } = useRewardedAd();

  const handleWatermarkRemoveClick = () => {
    if (isPremiumUser) {
      setShowWatermark(false);
      toast({
        title: t('premiumUser'),
        description: t('watermarkAutomaticallyRemoved'),
      });
    } else {
      setIsWatermarkDialogOpen(true);
    }
  };

  const handleWatchAd = async () => {
    setIsWatermarkDialogOpen(false);
    const completed = await showRewardedAd();
    if (completed) {
      setShowWatermark(false);
    }
  };

  const handleBePremium = () => {
    setIsWatermarkDialogOpen(false);
    setIsPremiumUser(true);
    setShowWatermark(false);
    toast({
      title: t('welcomeToPremium'),
      description: t('youAreNowPremiumUser'),
    });
  };

  return {
    showWatermark,
    isWatermarkDialogOpen,
    isPremiumUser,
    isLoading,
    setIsWatermarkDialogOpen,
    handleWatermarkRemoveClick,
    handleWatchAd,
    handleBePremium,
  };
};
