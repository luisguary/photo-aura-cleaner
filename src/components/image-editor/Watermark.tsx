
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { WatermarkProps } from '@/types/image-editor';

export const Watermark = ({ onRemove, showRemoveButton = true }: WatermarkProps) => (
  <div className="absolute bottom-2 right-2 bg-black/40 text-white px-3 py-1 rounded flex items-center">
    <span className="text-sm mr-2">Remove Background Pro</span>
    {showRemoveButton && (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full hover:bg-white/20 p-1"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    )}
  </div>
);
