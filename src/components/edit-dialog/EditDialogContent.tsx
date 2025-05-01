
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { EditControls } from './EditControls';
import { ImagePreviewPanel } from './ImagePreviewPanel';
import { useEditImage } from './useEditImage';
import { ScrollArea } from '../ui/scroll-area';

interface EditDialogContentProps {
  imageUrl: string;
  isOpen: boolean;
  onEditComplete: (editedImageUrl: string) => void;
  onCancel: () => void;
}

export const EditDialogContent = ({
  imageUrl,
  isOpen,
  onEditComplete,
  onCancel
}: EditDialogContentProps) => {
  const isMobile = useIsMobile();
  const {
    settings,
    previewUrl,
    isProcessing,
    activeTab,
    setActiveTab,
    handleSettingChange,
    generatePreview,
    handleReset,
    applyFinalEdits
  } = useEditImage(imageUrl, isOpen);

  const handleEditComplete = async () => {
    if (!previewUrl) {
      // If no preview exists yet, generate one first
      await generatePreview();
    }
    
    try {
      const finalUrl = await applyFinalEdits();
      // Call the parent component with the edited image URL
      onEditComplete(finalUrl);
    } catch (error) {
      console.error('Error in edit completion:', error);
    }
  };

  return (
    <>
      <ScrollArea className={isMobile ? "max-h-[70vh]" : "max-h-[75vh] pr-4"}>
        <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex flex-col md:flex-row gap-6'} mt-2`}>
          <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
            <h3 className="text-xs font-medium mb-2 sm:text-sm sm:mb-3">Adjustments</h3>
            <EditControls
              settings={settings}
              onSettingsChange={handleSettingChange}
              onGeneratePreview={generatePreview}
              onReset={handleReset}
              isProcessing={isProcessing}
              isMobile={isMobile}
            />
          </div>
          
          <div className={`${isMobile ? 'w-full mt-2' : 'flex-1'}`}>
            <ImagePreviewPanel 
              imageUrl={imageUrl} 
              previewUrl={previewUrl} 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex justify-between mt-3 sm:mt-4 gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
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
};
