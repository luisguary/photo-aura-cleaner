
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { WatermarkProps } from '@/types/image-editor';
import { useIsMobile } from '@/hooks/use-mobile';

export const Watermark = ({ onRemove, showRemoveButton = true }: WatermarkProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute bottom-2 right-2 bg-black/40 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded flex items-center">
      <span className="text-xs sm:text-sm mr-1 sm:mr-2">Remove Background Pro</span>
      {showRemoveButton && (
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full hover:bg-white/20 p-0.5 sm:p-1`}
          onClick={onRemove}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      )}
    </div>
  );
};
