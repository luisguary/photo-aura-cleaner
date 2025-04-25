
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Crop, X } from 'lucide-react';
import { CropArea, cropImage, loadImageFromUrl } from '@/utils/cropUtils';
import { toast } from './ui/use-toast';

interface CropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const CropDialog = ({ open, onOpenChange, imageUrl, onCropComplete }: CropDialogProps) => {
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (open && imageUrl) {
      // Reset crop area when dialog opens
      setPreviewUrl(null);
      
      // Initialize crop area after image loads
      const img = new Image();
      img.onload = () => {
        // Default crop area is 80% of the image
        const width = img.width * 0.8;
        const height = img.height * 0.8;
        const x = (img.width - width) / 2;
        const y = (img.height - height) / 2;
        
        setCropArea({ x, y, width, height });
      };
      img.src = imageUrl;
    }
  }, [open, imageUrl]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !cropArea) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is inside crop area
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !cropArea || !imageRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    
    // Calculate new position ensuring it stays within image bounds
    let newX = cropArea.x + dx;
    let newY = cropArea.y + dy;
    
    const imageWidth = imageRef.current.width;
    const imageHeight = imageRef.current.height;
    
    // Constrain to image boundaries
    newX = Math.max(0, Math.min(newX, imageWidth - cropArea.width));
    newY = Math.max(0, Math.min(newY, imageHeight - cropArea.height));
    
    setCropArea({
      ...cropArea,
      x: newX,
      y: newY
    });
    
    setDragStart({ x, y });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleGeneratePreview = async () => {
    if (!cropArea || !imageUrl) return;
    
    try {
      const img = await loadImageFromUrl(imageUrl);
      const croppedBlob = await cropImage(img, cropArea);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setPreviewUrl(previewUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate preview.",
      });
    }
  };
  
  const handleCropComplete = () => {
    if (previewUrl) {
      onCropComplete(previewUrl);
      onOpenChange(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please generate a preview first.",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crop className="mr-2 h-4 w-4" />
            Crop Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div 
            ref={containerRef}
            className="relative border border-gray-200 rounded-md overflow-hidden cursor-move"
            style={{ 
              width: '100%', 
              height: '400px',
              touchAction: 'none',
              position: 'relative' 
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Image to crop" 
              className="max-w-full max-h-full"
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none'
              }}
            />
            
            {cropArea && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/10"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                  cursor: 'move'
                }}
              />
            )}
          </div>
          
          {previewUrl && (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <h3 className="p-2 bg-gray-50 text-sm font-medium">Preview</h3>
              <img 
                src={previewUrl} 
                alt="Cropped preview" 
                className="max-w-full max-h-[400px] p-2" 
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={handleGeneratePreview}
              className="mr-2"
            >
              Generate Preview
            </Button>
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleCropComplete}
              disabled={!previewUrl}
            >
              Apply Crop
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
