
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface EditSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  filter: string;
}

interface EditControlsProps {
  settings: EditSettings;
  onSettingsChange: (setting: keyof EditSettings, value: number | string) => void;
  onGeneratePreview: () => void;
  onReset: () => void;
  isProcessing: boolean;
  isMobile: boolean;
}

export const EditControls = ({
  settings,
  onSettingsChange,
  onGeneratePreview,
  onReset,
  isProcessing,
  isMobile
}: EditControlsProps) => {
  return (
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
          onValueChange={(value) => onSettingsChange('brightness', value[0])}
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
          onValueChange={(value) => onSettingsChange('contrast', value[0])}
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
          onValueChange={(value) => onSettingsChange('saturation', value[0])}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Filters</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button
            variant={settings.filter === 'none' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'none')}
            className="h-auto py-2 text-xs sm:text-sm"
          >
            None
          </Button>
          <Button
            variant={settings.filter === 'grayscale' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'grayscale')}
            className="h-auto py-2 text-xs sm:text-sm"
          >
            Grayscale
          </Button>
          <Button
            variant={settings.filter === 'sepia' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'sepia')}
            className="h-auto py-2 text-xs sm:text-sm"
          >
            Sepia
          </Button>
        </div>
      </div>
      
      <div className="pt-2 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onReset}
          size={isMobile ? "sm" : "default"}
          className="text-xs sm:text-sm"
        >
          Reset
        </Button>
        <Button 
          onClick={onGeneratePreview}
          disabled={isProcessing}
          size={isMobile ? "sm" : "default"}
          className="text-xs sm:text-sm"
        >
          {isProcessing ? "Processing..." : "Apply Changes"}
        </Button>
      </div>
    </div>
  );
};

