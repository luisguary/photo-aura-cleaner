
import { ImagePreviewProps } from '@/types/image-editor';
import { ProcessingOverlay } from './ProcessingOverlay';
import { Watermark } from './Watermark';

export const ImagePreview = ({ 
  image,
  isProcessing,
  progress,
  showWatermark,
  selectedBackground,
  customBackground,
  onWatermarkRemove
}: ImagePreviewProps) => (
  <div className="relative rounded-lg overflow-hidden border border-gray-200">
    <div 
      className="relative" 
      style={{ 
        backgroundColor: selectedBackground === 'custom' ? 'transparent' : selectedBackground,
        backgroundImage: selectedBackground === 'transparent' ? 
          'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
          customBackground ? `url(${customBackground})` : 'none',
        backgroundSize: selectedBackground === 'transparent' ? '20px 20px' : 'cover',
        backgroundPosition: selectedBackground === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <img
        src={image}
        alt="Image being edited"
        className="max-w-full h-auto"
        style={{
          opacity: isProcessing ? 0.5 : 1,
        }}
      />
      {isProcessing && <ProcessingOverlay progress={progress} />}
      {showWatermark && <Watermark onRemove={onWatermarkRemove} />}
    </div>
  </div>
);
