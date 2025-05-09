
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun, Crown, Settings, User } from 'lucide-react';
import { Settings as SettingsDialog } from '../components/Settings';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { AdMobBanner } from '@/components/AdMobBanner';
import { Capacitor } from '@capacitor/core';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/components/auth/UserProfile';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
    <div className={`min-h-screen bg-white dark:bg-[#1A1F2C] transition-colors duration-200 p-2 sm:p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Logo and header */}
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-blue dark:text-white">
              {t('appTitle')}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-primary text-white flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
              size="sm"
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
                <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
              <span className="hidden xs:inline">Precios</span>
            </Button>
            
            {currentUser ? (
              <UserProfile />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthDialog(true)}
                className="flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="rounded-full w-8 h-8"
            >
              <Settings className="h-4 w-4" />
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
              className="rounded-full w-8 h-8"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <Card className="bg-white dark:bg-[#2A2F3C] backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-2 sm:p-4 md:p-6">
            {!selectedImage ? (
              <div className="space-y-4">
                <UploadZone onImageSelected={handleImageSelected} />
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
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <AdMobBanner
            adId={adMobBannerID}
            position="bottom"
            isTesting={true}
          />
        </div>
      )}

      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default Index;
