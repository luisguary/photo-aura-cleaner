
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';

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
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <div className="flex justify-between">
          <label htmlFor="brightness" className="text-xs sm:text-sm">Brightness</label>
          <span className="text-xs sm:text-sm">{settings.brightness}</span>
        </div>
        <Slider
          id="brightness"
          min={-100}
          max={100}
          step={5}
          value={[settings.brightness]}
          onValueChange={(value) => onSettingsChange('brightness', value[0])}
          className="h-4"
        />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex justify-between">
          <label htmlFor="contrast" className="text-xs sm:text-sm">Contrast</label>
          <span className="text-xs sm:text-sm">{settings.contrast}</span>
        </div>
        <Slider
          id="contrast"
          min={-100}
          max={100}
          step={5}
          value={[settings.contrast]}
          onValueChange={(value) => onSettingsChange('contrast', value[0])}
          className="h-4"
        />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex justify-between">
          <label htmlFor="saturation" className="text-xs sm:text-sm">Saturation</label>
          <span className="text-xs sm:text-sm">{settings.saturation}</span>
        </div>
        <Slider
          id="saturation"
          min={-100}
          max={100}
          step={5}
          value={[settings.saturation]}
          onValueChange={(value) => onSettingsChange('saturation', value[0])}
          className="h-4"
        />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <label className="text-xs sm:text-sm">Filters</label>
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          <Button
            variant={settings.filter === 'none' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'none')}
            className="h-7 sm:h-8 py-0 px-1 text-[10px] sm:text-xs"
            size={isMobile ? "sm" : "default"}
          >
            None
          </Button>
          <Button
            variant={settings.filter === 'grayscale' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'grayscale')}
            className="h-7 sm:h-8 py-0 px-1 text-[10px] sm:text-xs"
            size={isMobile ? "sm" : "default"}
          >
            Grayscale
          </Button>
          <Button
            variant={settings.filter === 'sepia' ? "default" : "outline"}
            onClick={() => onSettingsChange('filter', 'sepia')}
            className="h-7 sm:h-8 py-0 px-1 text-[10px] sm:text-xs"
            size={isMobile ? "sm" : "default"}
          >
            Sepia
          </Button>
        </div>
      </div>
      
      <div className="pt-1 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onReset}
          size={isMobile ? "sm" : "default"}
          className="h-7 sm:h-8 text-[10px] sm:text-xs px-2"
        >
          Reset
        </Button>
        <Button 
          onClick={onGeneratePreview}
          disabled={isProcessing}
          size={isMobile ? "sm" : "default"}
          className="h-7 sm:h-8 text-[10px] sm:text-xs px-2"
        >
          {isProcessing ? "Processing..." : "Apply Changes"}
        </Button>
      </div>
    </div>
  );
};

