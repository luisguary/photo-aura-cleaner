
import { Button } from './ui/button';
import { Eraser, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { ImageEditorProps } from '@/types/image-editor';
import { useImageEditor } from '@/hooks/useImageEditor';
import { useIsMobile } from '@/hooks/use-mobile';

import BackgroundSelector from './BackgroundSelector';
import ImageActions from './ImageActions';
import CropDialog from './CropDialog';
import ResizeDialog from './ResizeDialog';
import EditDialog from './edit-dialog/EditDialog';
import { ImagePreview } from './image-editor/ImagePreview';
import { DownloadButtons } from './image-editor/DownloadButtons';
import { WatermarkDialog } from './image-editor/WatermarkDialog';
import { QualityDialog } from './image-editor/QualityDialog';
import { AdCompletedDialog } from './image-editor/AdCompletedDialog';

const ImageEditor = ({ initialImage, fileName, onReset }: ImageEditorProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const {
    isProcessing,
    editedImage,
    progress,
    selectedBackground,
    customBackground,
    showWatermark,
    isWatermarkDialogOpen,
    isAdWatchedDialogOpen,
    isPremiumUser,
    isQualityDialogOpen,
    isProcessingAd,
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    setIsWatermarkDialogOpen,
    setIsQualityDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setSelectedBackground,
    handleRemoveBackground,
    handleWatermarkRemoveClick,
    handleWatchAd,
    handleAdWatched,
    handleBePremium,
    handleQualityDownloadRequest,
    handleWatchAdForQualityRequest,
    handleBePremiumForQualityRequest,
    handleCustomBackground,
    handleCropComplete,
    handleResizeComplete,
    handleEditComplete,
  } = useImageEditor(initialImage, fileName);

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isProcessing}
          className="text-xs md:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          {isProcessing ? (
            <div className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 animate-spin" />
          ) : (
            <Eraser className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          )}
          {t('removeBackground')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isProcessing}
          className="text-xs md:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          {t('reset')}
        </Button>

        <DownloadButtons 
          onDownload={handleQualityDownloadRequest}
          isPremiumUser={isPremiumUser}
          isProcessing={isProcessing}
          isProcessingAd={isProcessingAd}
        />
      </div>

      {!isProcessing && (
        <ImageActions 
          onCrop={() => setIsCropDialogOpen(true)}
          onResize={() => setIsResizeDialogOpen(true)}
          onEdit={() => setIsEditDialogOpen(true)}
          isPremium={isPremiumUser}
        />
      )}

      <ImagePreview 
        image={editedImage || initialImage}
        isProcessing={isProcessing}
        progress={progress}
        showWatermark={editedImage && showWatermark ? true : false}
        selectedBackground={selectedBackground}
        customBackground={customBackground}
        onWatermarkRemove={handleWatermarkRemoveClick}
      />

      {editedImage && (
        <BackgroundSelector
          selectedBackground={selectedBackground}
          onSelectBackground={setSelectedBackground}
          onSelectCustomBackground={handleCustomBackground}
        />
      )}

      <CropDialog
        open={isCropDialogOpen}
        onOpenChange={setIsCropDialogOpen}
        imageUrl={editedImage || initialImage}
        onCropComplete={handleCropComplete}
      />

      <ResizeDialog
        open={isResizeDialogOpen}
        onOpenChange={setIsResizeDialogOpen}
        imageUrl={editedImage || initialImage}
        onResizeComplete={handleResizeComplete}
      />

      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        imageUrl={editedImage || initialImage}
        onEditComplete={handleEditComplete}
      />

      <WatermarkDialog
        isOpen={isWatermarkDialogOpen}
        onOpenChange={setIsWatermarkDialogOpen}
        onWatchAd={handleWatchAd}
        onBePremium={handleBePremium}
      />

      <QualityDialog
        isOpen={isQualityDialogOpen}
        onOpenChange={setIsQualityDialogOpen}
        onWatchAd={handleWatchAdForQualityRequest}
        onBePremium={handleBePremiumForQualityRequest}
      />

      <AdCompletedDialog
        isOpen={isAdWatchedDialogOpen}
        onOpenChange={() => handleAdWatched()}
        onContinue={handleAdWatched}
      />
    </div>
  );
};

export default ImageEditor;
