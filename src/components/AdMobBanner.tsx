import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface AdMobBannerProps {
  adId: string;
  position?: 'top' | 'bottom';
  isTesting?: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ 
  adId = 'ca-app-pub-1145055690439051/2327498019', 
  position = 'bottom', 
  isTesting = false 
}) => {
  const [adInitialized, setAdInitialized] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        // Only initialize on a real device
        if (Capacitor.isNativePlatform()) {
          await AdMob.initialize({
            testingDevices: [adId],
            initializeForTesting: isTesting,
          });
          setAdInitialized(true);
          showBanner();
        }
      } catch (error) {
        setAdError(`Failed to initialize AdMob: ${error}`);
        console.error('AdMob initialization failed:', error);
      }
    };

    initializeAdMob();

    return () => {
      // Clean up the banner when component unmounts
      if (adInitialized && Capacitor.isNativePlatform()) {
        AdMob.removeBanner().catch(e => console.error('Error removing banner:', e));
      }
    };
  }, [adId, isTesting]);

  const showBanner = async () => {
    try {
      if (!adInitialized || !Capacitor.isNativePlatform()) {
        return;
      }

      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.BANNER,
        position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting
      };

      await AdMob.showBanner(options);
    } catch (error) {
      setAdError(`Failed to show banner: ${error}`);
      console.error('Failed to show banner ad:', error);
    }
  };

  // We don't render anything directly in React, as AdMob renders native views
  // This component just handles the initialization and lifecycle
  return (
    <div className="admob-banner-placeholder" style={{ display: 'none' }}>
      {adError && <span className="hidden">{adError}</span>}
    </div>
  );
};
