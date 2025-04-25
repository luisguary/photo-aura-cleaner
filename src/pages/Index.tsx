
import { useState } from 'react';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Editor de Fotos AI
          </h1>
          <ThemeToggle />
        </div>
        
        <Card className="bg-card/95 backdrop-blur-sm shadow-xl">
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
