
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { MinusCircle, X } from 'lucide-react';
import { resizeImage } from '@/utils/resizeUtils';
import { toast } from './ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';

interface ResizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onResizeComplete: (resizedImageUrl: string) => void;
}

const ResizeDialog = ({ open, onOpenChange, imageUrl, onResizeComplete }: ResizeDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizePercentage, setResizePercentage] = useState<number>(75);
  const [customWidth, setCustomWidth] = useState<number | undefined>(undefined);
  const [customHeight, setCustomHeight] = useState<number | undefined>(undefined);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load original dimensions when dialog opens
  useState(() => {
    if (open && imageUrl) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height
        });
        setCustomWidth(img.width);
        setCustomHeight(img.height);
      };
      img.src = imageUrl;
    }
  });

  const handlePercentageClick = async (percentage: number) => {
    setResizePercentage(percentage);
    await generatePreview({ percentage });
  };

  const handleCustomResize = async () => {
    if (customWidth || customHeight) {
      await generatePreview({ 
        width: customWidth,
        height: customHeight
      });
    }
  };

  const generatePreview = async (options: {
    percentage?: number;
    width?: number;
    height?: number;
  }) => {
    try {
      setIsProcessing(true);
      const resizedBlob = await resizeImage(imageUrl, options);
      
      // Clean up previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(resizedBlob);
      setPreviewUrl(newPreviewUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate preview.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResizeComplete = () => {
    if (previewUrl) {
      onResizeComplete(previewUrl);
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
            <MinusCircle className="mr-2 h-4 w-4" />
            Resize Image
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue="percentage">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="percentage">Preset Sizes</TabsTrigger>
              <TabsTrigger value="custom">Custom Size</TabsTrigger>
            </TabsList>
            
            <TabsContent value="percentage" className="mt-4">
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => handlePercentageClick(75)} 
                  variant={resizePercentage === 75 ? "default" : "outline"}
                >
                  75%
                </Button>
                <Button 
                  onClick={() => handlePercentageClick(50)} 
                  variant={resizePercentage === 50 ? "default" : "outline"}
                >
                  50%
                </Button>
                <Button 
                  onClick={() => handlePercentageClick(25)} 
                  variant={resizePercentage === 25 ? "default" : "outline"}
                >
                  25%
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <label htmlFor="width" className="text-sm font-medium">
                    Width (px)
                  </label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || undefined)}
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <label htmlFor="height" className="text-sm font-medium">
                    Height (px)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || undefined)}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleCustomResize}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Preview"}
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Original dimensions: {originalDimensions.width} x {originalDimensions.height}px
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 border border-gray-200 rounded-md p-2">
            <h3 className="text-sm font-medium mb-2">Original</h3>
            <img 
              src={imageUrl} 
              alt="Original image" 
              className="max-w-full max-h-[300px] mx-auto" 
            />
          </div>
          
          <div className="flex-1 border border-gray-200 rounded-md p-2">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Resized preview" 
                className="max-w-full max-h-[300px] mx-auto" 
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] bg-gray-50 text-gray-400">
                No preview generated yet
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="default"
            onClick={handleResizeComplete}
            disabled={!previewUrl}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResizeDialog;
