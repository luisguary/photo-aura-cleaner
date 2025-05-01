
import { ImagePreviewProps } from '@/types/image-editor';
import { ProcessingOverlay } from './ProcessingOverlay';
import { Watermark } from './Watermark';
import { AspectRatio } from '../ui/aspect-ratio';
import { useState, useEffect } from 'react';

export const ImagePreview = ({ 
  image,
  isProcessing,
  progress,
  showWatermark,
  selectedBackground,
  customBackground,
  onWatermarkRemove
}: ImagePreviewProps) => {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16/9);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Calculate aspect ratio when image changes
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setImageAspectRatio(ratio);
        setIsImageLoaded(true);
      };
      img.src = image;
    }
  }, [image]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200">
      <div 
        className="relative w-full" 
        style={{ 
          backgroundColor: selectedBackground === 'custom' ? 'transparent' : selectedBackground,
          backgroundImage: selectedBackground === 'transparent' ? 
            'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
            customBackground ? `url(${customBackground})` : 'none',
          backgroundSize: selectedBackground === 'transparent' ? '20px 20px' : 'cover',
          backgroundPosition: selectedBackground === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {isImageLoaded ? (
          <AspectRatio ratio={imageAspectRatio} className="w-full">
            <img
              src={image}
              alt="Image being edited"
              className="w-full h-full object-contain"
              style={{
                opacity: isProcessing ? 0.5 : 1,
                maxHeight: '65vh',
              }}
            />
            {isProcessing && <ProcessingOverlay progress={progress} />}
            {showWatermark && <Watermark onRemove={onWatermarkRemove} />}
          </AspectRatio>
        ) : (
          <div className="w-full flex items-center justify-center" style={{ height: '250px' }}>
            <div className="animate-pulse rounded-md bg-muted w-12 h-12"></div>
          </div>
        )}
      </div>
    </div>
  );
};
