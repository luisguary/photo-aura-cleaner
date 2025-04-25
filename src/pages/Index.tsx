
import { useState } from 'react';
import ImageEditor from '../components/ImageEditor';
import UploadZone from '../components/UploadZone';
import { Card, CardContent } from '../components/ui/card';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Editor de Fotos AI
        </h1>
        
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
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
