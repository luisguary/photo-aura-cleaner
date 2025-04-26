
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun, Crown, ArrowUpCircle, X } from 'lucide-react';
import { Settings } from '../components/Settings';
import { DeblurButton } from '../components/DeblurButton';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ScaleWithAIButton } from '@/components/ScaleWithAIButton';
import { AdMobBanner } from '@/components/AdMobBanner';
import { Capacitor } from '@capacitor/core';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Check if we're running on a device
  const isMobileDevice = Capacitor.isNativePlatform();
  // AdMob ID
  const adMobBannerID = 'ca-app-pub-1145055690439051/7440147911';

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Listen for changes in system preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  const handleImageSelected = (imageUrl: string, fileName: string) => {
    setSelectedImage(imageUrl);
    setSelectedFileName(fileName);
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-[#1A1F2C] transition-colors duration-200 p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Logo and header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-blue dark:text-white">
              {t('appTitle')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-primary text-white flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="h-5 w-5" />
              </motion.div>
              Precios
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newTheme = theme === 'light' ? 'dark' : 'light';
                setTheme(newTheme);
                if (newTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        <Card className="bg-white dark:bg-[#2A2F3C] backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6">
            {!selectedImage ? (
              <div className="space-y-4">
                <UploadZone onImageSelected={handleImageSelected} />
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                  <DeblurButton
                    isPremium={false}
                    onImageProcessed={(url) => {
                      setSelectedImage(url);
                      setSelectedFileName("enhanced-image.jpg");
                    }}
                    className="w-full md:w-auto"
                  />
                  <ScaleWithAIButton 
                    onImageProcessed={(url) => {
                      setSelectedImage(url);
                      setSelectedFileName("scaled-image.jpg");
                    }}
                    isPremium={false}
                  />
                </div>
              </div>
            ) : (
              <ImageEditor
                initialImage={selectedImage}
                fileName={selectedFileName || "imagen"}
                onReset={() => {
                  setSelectedImage(null);
                  setSelectedFileName(null);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* AdMob Banner */}
      {isMobileDevice && (
        <AdMobBanner
          adId={adMobBannerID}
          position="bottom"
          isTesting={true} // Set to false for production
        />
      )}

      <Settings />
    </div>
  );
};

export default Index;
