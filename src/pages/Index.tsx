
import { useState, useEffect } from 'react';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Settings } from '../components/Settings';
import { DeblurButton } from '../components/DeblurButton';
import { useTranslation } from '../hooks/useTranslation';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { t } = useTranslation();

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
        
        <Card className="bg-white dark:bg-[#2A2F3C] backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-6">
            {!selectedImage ? (
              <div className="space-y-4">
                <UploadZone onImageSelected={handleImageSelected} />
                <div className="flex justify-center mt-4">
                  <DeblurButton
                    isPremium={false}
                    onImageProcessed={(url) => {
                      setSelectedImage(url);
                      setSelectedFileName("enhanced-image.jpg");
                    }}
                    className="ml-2"
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

      <Settings />
    </div>
  );
};

export default Index;
