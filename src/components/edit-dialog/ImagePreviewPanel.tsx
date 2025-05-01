
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AspectRatio } from '../ui/aspect-ratio';
import { useState, useEffect } from 'react';

interface ImagePreviewPanelProps {
  imageUrl: string;
  previewUrl: string | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ImagePreviewPanel = ({ 
  imageUrl, 
  previewUrl, 
  activeTab,
  setActiveTab 
}: ImagePreviewPanelProps) => {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16/9);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Calculate aspect ratio when images change
  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setImageAspectRatio(ratio);
        setIsImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="original" className="text-xs sm:text-sm">Original</TabsTrigger>
        <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="original" className="mt-2">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {isImageLoaded ? (
            <AspectRatio ratio={imageAspectRatio} className="w-full">
              <img 
                src={imageUrl} 
                alt="Original image" 
                className="w-full h-full object-contain" 
              />
            </AspectRatio>
          ) : (
            <div className="flex items-center justify-center h-[150px] sm:h-[180px] md:h-[200px] bg-muted/20">
              <div className="animate-pulse rounded-md bg-muted w-10 h-10"></div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-2">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {previewUrl && isImageLoaded ? (
            <AspectRatio ratio={imageAspectRatio} className="w-full">
              <img 
                src={previewUrl} 
                alt="Edited preview" 
                className="w-full h-full object-contain" 
              />
            </AspectRatio>
          ) : (
            <div className="flex items-center justify-center h-[150px] sm:h-[180px] md:h-[200px] bg-gray-50 text-gray-400 text-xs sm:text-sm">
              {previewUrl ? (
                <div className="animate-pulse rounded-md bg-muted w-10 h-10"></div>
              ) : (
                "No preview generated yet"
              )}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
