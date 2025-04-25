
import { useState, useEffect } from 'react';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  return (
    <div className={`min-h-screen bg-white dark:bg-[#1A1F2C] transition-colors duration-200 p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Logo y encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-blue dark:text-white">
              Quitar Fondo Pro
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
              <UploadZone onImageSelected={setSelectedImage} />
            ) : (
              <ImageEditor
                initialImage={selectedImage}
                onReset={() => setSelectedImage(null)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
