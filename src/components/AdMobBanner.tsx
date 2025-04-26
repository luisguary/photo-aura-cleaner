
import React, { useEffect, useState } from 'react';
import { isPlatform } from '@capacitor/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

interface AdMobBannerProps {
  adId: string;
  position?: 'top' | 'bottom';
  isTesting?: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ 
  adId, 
  position = 'bottom', 
  isTesting = true 
}) => {
  const [adInitialized, setAdInitialized] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        // Only initialize on a real device
        if (isPlatform('android') || isPlatform('ios')) {
          await AdMob.initialize({
            requestTrackingAuthorization: true,
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
      if (adInitialized && (isPlatform('android') || isPlatform('ios'))) {
        AdMob.removeBanner().catch(e => console.error('Error removing banner:', e));
      }
    };
  }, [adId, isTesting]);

  const showBanner = async () => {
    try {
      if (!adInitialized || !(isPlatform('android') || isPlatform('ios'))) {
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
      {adError && console.error(adError)}
    </div>
  );
};
