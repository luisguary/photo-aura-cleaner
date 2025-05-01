
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { applyImageEdits, generatePreviewUrl } from '@/utils/editUtils';

export interface EditSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  filter: string;
}

export const useEditImage = (imageUrl: string, isOpen: boolean) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    filter: 'none'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("original");

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
    if (isOpen) {
      handleReset();
    }
  }, [isOpen, imageUrl]);

  // Generate a new preview when settings change
  useEffect(() => {
    if (!isOpen || !imageUrl) return;
    
    // Generate a temporary preview instantly for responsive UI
    const livePreviewUrl = generatePreviewUrl(imageUrl, settings);
    setPreviewUrl(livePreviewUrl);
  }, [settings, imageUrl, isOpen]);

  const handleSettingChange = (setting: keyof EditSettings, value: number | string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value
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

  const applyFinalEdits = async (): Promise<string> => {
    try {
      setIsProcessing(true);
      const finalEditedBlob = await applyImageEdits(imageUrl, settings);
      const finalUrl = URL.createObjectURL(finalEditedBlob);
      return finalUrl;
    } catch (error) {
      console.error('Error applying edits:', error);
      throw new Error('Failed to apply edits to the image');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    settings,
    previewUrl,
    isProcessing,
    activeTab,
    setActiveTab,
    handleSettingChange,
    generatePreview,
    handleReset,
    applyFinalEdits
  };
};

