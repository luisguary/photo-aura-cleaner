
import { AdMob, AdOptions, RewardAdOptions, AdLoadInfo } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useCallback, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

export const useRewardedAd = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const adId = 'ca-app-pub-1145055690439051/2604438417';
  const isMobileDevice = Capacitor.isNativePlatform();

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    if (!isMobileDevice) return false;
    setIsLoading(true);

    try {
      const options: RewardAdOptions = {
        adId,
        isTesting: false,
        npa: true,
      };

      // Prepare and show the rewarded ad
      await AdMob.prepareRewardVideoAd(options);
      
      const result = await AdMob.showRewardVideoAd();
      
      setIsLoading(false);
      
      // Check if the user completed watching the ad
      if (result.reward) {
        toast({
          title: t('success'),
          description: t('watermarkWillBeRemoved'),
        });
        return true;
      } else {
        toast({
          title: t('error'),
          description: t('watchEntireAdToRemoveWatermark'),
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      setIsLoading(false);
      toast({
        title: t('error'),
        description: t('errorShowingAd'),
        variant: "destructive"
      });
      return false;
    }
  }, [isMobileDevice, t]);

  return { showRewardedAd, isLoading };
};
