import { useState } from 'react';
import { Button } from './ui/button';
import { Eraser, RotateCcw, X } from 'lucide-react';
import { removeBackground } from '../utils/imageUtils';
import { upscaleImage } from '../utils/upscaleUtils';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ImageEditorProps } from '@/types/image-editor';

import BackgroundSelector from './BackgroundSelector';
import ImageActions from './ImageActions';
import CropDialog from './CropDialog';
import ResizeDialog from './ResizeDialog';
import EditDialog from './EditDialog';
import { ImagePreview } from './image-editor/ImagePreview';
import { DownloadButtons } from './image-editor/DownloadButtons';

const ImageEditor = ({ initialImage, fileName, onReset }: ImageEditorProps) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState<string>('transparent');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isWatermarkDialogOpen, setIsWatermarkDialogOpen] = useState(false);
  const [isAdWatchedDialogOpen, setIsAdWatchedDialogOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
  const [isProcessingAd, setIsProcessingAd] = useState(false);
  
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isResizeDialogOpen, setIsResizeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleRemoveBackground = async () => {
    try {
      setIsProcessing(true);
      setProgress(t('processingImage'));
      toast({
        title: t('processingImage'),
        description: t('processingImageWait'),
      });

      const img = new Image();
      img.src = initialImage;
      await new Promise((resolve) => (img.onload = resolve));

      const resultBlob = await removeBackground(img);
      const resultUrl = URL.createObjectURL(resultBlob);
      setEditedImage(resultUrl);

      toast({
        title: t('success'),
        description: t('imageEnhanced'),
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('failedToProcess'),
      });
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleUpscale = async (scale: number) => {
    try {
      setIsProcessing(true);
      setProgress(`Upscaling image to ${scale}x...`);

      const imageToUpscale = editedImage || initialImage;
      
      const response = await fetch(imageToUpscale);
      const imageBlob = await response.blob();
      
      const upscaledBlob = await upscaleImage(imageBlob, scale);
      
      if (upscaledBlob) {
        const upscaledUrl = URL.createObjectURL(upscaledBlob);
        setUpscaledImage(upscaledUrl);
        
        if (editedImage) {
          setEditedImage(upscaledUrl);
        } else {
          setEditedImage(upscaledUrl);
        }
        
        toast({
          title: "Done!",
          description: `Image successfully upscaled to ${scale}x`,
        });
      }
    } catch (error) {
      console.error('Error upscaling image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem upscaling the image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleDownload = async (isHighQuality: boolean) => {
    try {
      const response = await fetch(editedImage || initialImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced_${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('failedToProcess'),
      });
    }
  };

  const handleWatermarkRemoveClick = () => {
    if (isPremiumUser) {
      setShowWatermark(false);
      toast({
        title: "Premium User",
        description: "Watermark automatically removed",
      });
    } else {
      setIsWatermarkDialogOpen(true);
    }
  };

  const handleWatchAd = () => {
    setIsWatermarkDialogOpen(false);
    setProgress('Loading ad...');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProgress('');
      setIsAdWatchedDialogOpen(true);
    }, 2000);
  };

  const handleAdWatched = () => {
    setIsAdWatchedDialogOpen(false);
    setShowWatermark(false);
    toast({
      title: "Thank you!",
      description: "Watermark successfully removed",
    });
  };

  const handleBePremium = () => {
    setIsWatermarkDialogOpen(false);
    setIsPremiumUser(true);
    setShowWatermark(false);
    toast({
      title: "Welcome to Premium!",
      description: "You are now a Premium user and won't see watermarks",
    });
  };

  const handleQualityDownload = () => {
    if (isPremiumUser) {
      handleDownload(true);
    } else {
      setIsQualityDialogOpen(true);
    }
  };

  const handleWatchAdForQuality = () => {
    setIsQualityDialogOpen(false);
    setIsProcessingAd(true);
    setProgress('Loading ad...');
    
    setTimeout(() => {
      setIsProcessingAd(false);
      setProgress('');
      handleDownload(true);
      toast({
        title: "Thank you for watching the ad!",
        description: "Your image will download in maximum quality",
      });
    }, 2000);
  };

  const handleBePremiumForQuality = () => {
    setIsQualityDialogOpen(false);
    setIsPremiumUser(true);
    handleDownload(true);
    toast({
      title: "Welcome to Premium!",
      description: "You can now download all your images in maximum quality",
    });
  };

  const handleCustomBackground = (imageUrl: string) => {
    setCustomBackground(imageUrl);
    setSelectedBackground('custom');
  };

  const handleCropComplete = async (croppedImage: string) => {
    setEditedImage(croppedImage);
    setIsCropDialogOpen(false);
  };

  const handleResizeComplete = async (resizedImage: string) => {
    setEditedImage(resizedImage);
    setIsResizeDialogOpen(false);
  };

  const handleEditComplete = async (editedImg: string) => {
    setEditedImage(editedImg);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eraser className="w-4 h-4 mr-2" />
          )}
          {t('removeBackground')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('reset')}
        </Button>

        <DownloadButtons 
          onDownload={handleQualityDownload}
          isPremiumUser={isPremiumUser}
          isProcessing={isProcessing}
          isProcessingAd={isProcessingAd}
        />
      </div>

      {!isProcessing && (
        <ImageActions 
          onUpscale={handleUpscale}
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

      <Dialog open={isWatermarkDialogOpen} onOpenChange={setIsWatermarkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('removeWatermark')}</DialogTitle>
            <DialogDescription>
              {t('watchAdToUse')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAd}
            >
              {t('watchAdRemoveWatermark')}
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremium}
            >
              {t('becomePremiumUser')}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full" 
            onClick={() => setIsWatermarkDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isQualityDialogOpen} onOpenChange={setIsQualityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('highQualityDownload')}</DialogTitle>
            <DialogDescription>
              {t('watchAdToUse')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAdForQuality}
            >
              {t('watchAdHighQuality')}
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremiumForQuality}
            >
              {t('becomePremiumUser')}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full" 
            onClick={() => setIsQualityDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAdWatchedDialogOpen} onOpenChange={setIsAdWatchedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('adCompleted')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('adCompletedThankYou')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAdWatched}>{t('continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageEditor;
