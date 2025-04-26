
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useCallback } from 'react';

export const useInterstitialAd = () => {
  const adId = 'ca-app-pub-1145055690439051/2604438417';
  const isMobileDevice = Capacitor.isNativePlatform();

  const showInterstitial = useCallback(async () => {
    if (!isMobileDevice) return;

    try {
      const options: AdOptions = {
        adId,
        isTesting: false, // Set to false for production
      };

      // Prepare the interstitial
      await AdMob.prepareInterstitial(options);
      
      // Check if the ad is ready using the correct method
      const isReady = await AdMob.isLoaded();
      
      if (isReady) {
        // Show the interstitial ad
        await AdMob.showInterstitial();
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      // Silently fail to not interrupt user experience
    }
  }, [isMobileDevice]);

  return { showInterstitial };
};
