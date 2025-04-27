
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { useCallback } from 'react';

export const useInterstitialAd = () => {
  const adId = 'ca-app-pub-1145055690439051/4830613670';
  const isMobileDevice = Capacitor.isNativePlatform();

  const showInterstitial = useCallback(async () => {
    if (!isMobileDevice) return;

    try {
      const options: AdOptions = {
        adId,
        isTesting: false,
      };

      // Prepare the interstitial
      await AdMob.prepareInterstitial(options);
      
      // Show the interstitial ad
      await AdMob.showInterstitial();
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }, [isMobileDevice]);

  return { showInterstitial };
};

