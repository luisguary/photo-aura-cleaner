
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Edit, X } from 'lucide-react';
import { applyImageEdits } from '@/utils/editUtils';
import { toast } from './ui/use-toast';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onEditComplete: (editedImageUrl: string) => void;
}

interface EditSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  filter: string;
}

const EditDialog = ({ open, onOpenChange, imageUrl, onEditComplete }: EditDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    filter: 'none'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSettingChange = (setting: keyof EditSettings, value: number | string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleFilterChange = (filter: string) => {
    setSettings((prev) => ({
      ...prev,
      filter
    }));
  };

  const generatePreview = async () => {
    try {
      setIsProcessing(true);
      
      // Clean up previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const editedBlob = await applyImageEdits(imageUrl, settings);
      const newPreviewUrl = URL.createObjectURL(editedBlob);
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

  const handleReset = () => {
    setSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      filter: 'none'
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleEditComplete = () => {
    if (previewUrl) {
      onEditComplete(previewUrl);
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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-4">Adjustments</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="brightness" className="text-sm">Brightness</label>
                  <span className="text-sm">{settings.brightness}</span>
                </div>
                <Slider
                  id="brightness"
                  min={-100}
                  max={100}
                  step={5}
                  value={[settings.brightness]}
                  onValueChange={(value) => handleSettingChange('brightness', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="contrast" className="text-sm">Contrast</label>
                  <span className="text-sm">{settings.contrast}</span>
                </div>
                <Slider
                  id="contrast"
                  min={-100}
                  max={100}
                  step={5}
                  value={[settings.contrast]}
                  onValueChange={(value) => handleSettingChange('contrast', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="saturation" className="text-sm">Saturation</label>
                  <span className="text-sm">{settings.saturation}</span>
                </div>
                <Slider
                  id="saturation"
                  min={-100}
                  max={100}
                  step={5}
                  value={[settings.saturation]}
                  onValueChange={(value) => handleSettingChange('saturation', value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Filters</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Button
                    variant={settings.filter === 'none' ? "default" : "outline"}
                    onClick={() => handleFilterChange('none')}
                    className="h-auto py-2"
                  >
                    None
                  </Button>
                  <Button
                    variant={settings.filter === 'grayscale' ? "default" : "outline"}
                    onClick={() => handleFilterChange('grayscale')}
                    className="h-auto py-2"
                  >
                    Grayscale
                  </Button>
                  <Button
                    variant={settings.filter === 'sepia' ? "default" : "outline"}
                    onClick={() => handleFilterChange('sepia')}
                    className="h-auto py-2"
                  >
                    Sepia
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button 
                  onClick={generatePreview}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Apply Changes"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <Tabs defaultValue="original">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="original" className="mt-2">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Original image" 
                    className="max-w-full max-h-[500px] mx-auto" 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-2">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Edited preview" 
                      className="max-w-full max-h-[500px] mx-auto" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px] bg-gray-50 text-gray-400">
                      No preview generated yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="default"
            onClick={handleEditComplete}
            disabled={!previewUrl}
          >
            Apply Edits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
