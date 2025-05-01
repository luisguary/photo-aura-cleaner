
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Edit, X } from 'lucide-react';
import { applyImageEdits, generatePreviewUrl } from '@/utils/editUtils';
import { toast } from './ui/use-toast';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from './ui/drawer';

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
  const [activeTab, setActiveTab] = useState("original");
  const isMobile = useIsMobile();

  // Clean up previous preview URL when dialog closes or when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Reset settings when dialog opens with a new image
  useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open, imageUrl]);

  // Generate a new preview when settings change
  useEffect(() => {
    if (!open || !imageUrl) return;
    
    // Generate a temporary preview instantly for responsive UI
    const livePreviewUrl = generatePreviewUrl(imageUrl, settings);
    setPreviewUrl(livePreviewUrl);
  }, [settings, imageUrl, open]);

  const handleSettingChange = (setting: keyof EditSettings, value: number | string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value
    }));
    setActiveTab("preview"); // Switch to preview tab automatically
  };

  const handleFilterChange = (filter: string) => {
    setSettings((prev) => ({
      ...prev,
      filter
    }));
    setActiveTab("preview"); // Switch to preview tab automatically
  };

  const generatePreview = async () => {
    try {
      setIsProcessing(true);
      
      // Clean up previous preview URL if it's a blob URL
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const editedBlob = await applyImageEdits(imageUrl, settings);
      const newPreviewUrl = URL.createObjectURL(editedBlob);
      setPreviewUrl(newPreviewUrl);
      setActiveTab("preview");
      
      toast({
        title: "Success",
        description: "Preview generated successfully",
      });
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
    // Reset all settings to default
    setSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      filter: 'none'
    });

    // Clean up previous preview URL if it's a blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setActiveTab("original");
    
    toast({
      title: "Settings Reset",
      description: "All edit settings have been reset to default values.",
    });
  };

  const handleEditComplete = async () => {
    if (!previewUrl) {
      // If no preview exists yet, generate one first
      await generatePreview();
    }
    
    if (previewUrl) {
      // Apply the final edits by creating a proper blob
      try {
        setIsProcessing(true);
        const finalEditedBlob = await applyImageEdits(imageUrl, settings);
        const finalUrl = URL.createObjectURL(finalEditedBlob);
        
        // Call the parent component with the edited image URL
        onEditComplete(finalUrl);
        onOpenChange(false);
        
        toast({
          title: "Success",
          description: "Image edited successfully!",
        });
      } catch (error) {
        console.error('Error applying edits:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to apply edits to the image.",
        });
        setIsProcessing(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please generate a preview first.",
      });
    }
  };

  const handleCancel = () => {
    // Clean up the preview URL before closing
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    onOpenChange(false);
  };

  const renderEditContent = () => (
    <>
      <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex flex-col md:flex-row gap-6'} mt-4`}>
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
                  className="h-auto py-2 text-xs sm:text-sm"
                >
                  None
                </Button>
                <Button
                  variant={settings.filter === 'grayscale' ? "default" : "outline"}
                  onClick={() => handleFilterChange('grayscale')}
                  className="h-auto py-2 text-xs sm:text-sm"
                >
                  Grayscale
                </Button>
                <Button
                  variant={settings.filter === 'sepia' ? "default" : "outline"}
                  onClick={() => handleFilterChange('sepia')}
                  className="h-auto py-2 text-xs sm:text-sm"
                >
                  Sepia
                </Button>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleReset}
                size={isMobile ? "sm" : "default"}
                className="text-xs sm:text-sm"
              >
                Reset
              </Button>
              <Button 
                onClick={generatePreview}
                disabled={isProcessing}
                size={isMobile ? "sm" : "default"}
                className="text-xs sm:text-sm"
              >
                {isProcessing ? "Processing..." : "Apply Changes"}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="original" className="text-xs sm:text-sm">Original</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="original" className="mt-2">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Original image" 
                  className="max-w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] mx-auto" 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-2">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Edited preview" 
                    className="max-w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] mx-auto" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-[200px] sm:h-[250px] md:h-[300px] bg-gray-50 text-gray-400">
                    No preview generated yet
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 gap-2">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          size={isMobile ? "sm" : "default"}
          className="text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <Button 
          variant="default"
          onClick={handleEditComplete}
          disabled={isProcessing}
          size={isMobile ? "sm" : "default"}
          className="text-xs sm:text-sm"
        >
          Apply Edits
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-8 pt-2 max-h-[85vh] overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Image
            </DrawerTitle>
          </DrawerHeader>
          {renderEditContent()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Image
          </DialogTitle>
        </DialogHeader>
        {renderEditContent()}
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
