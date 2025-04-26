import { useState } from 'react';
import { Button } from './ui/button';
import { Eraser, RotateCcw, Download, Loader, X } from 'lucide-react';
import { removeBackground } from '../utils/imageUtils';
import { upscaleImage } from '../utils/upscaleUtils';
import { toast } from './ui/use-toast';
import BackgroundSelector from './BackgroundSelector';
import ImageActions from './ImageActions';
import CropDialog from './CropDialog';
import ResizeDialog from './ResizeDialog';
import EditDialog from './EditDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface ImageEditorProps {
  initialImage: string;
  fileName: string;
  onReset: () => void;
}

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

  const handleCrop = () => {
    setIsCropDialogOpen(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setEditedImage(croppedImageUrl);
    toast({
      title: "Image Cropped",
      description: "Your image has been successfully cropped.",
    });
  };

  const handleResize = () => {
    setIsResizeDialogOpen(true);
  };

  const handleResizeComplete = (resizedImageUrl: string) => {
    setEditedImage(resizedImageUrl);
    toast({
      title: "Image Resized",
      description: "Your image has been successfully resized.",
    });
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditComplete = (editedImageUrl: string) => {
    setEditedImage(editedImageUrl);
    toast({
      title: "Image Edited",
      description: "Your image edits have been applied.",
    });
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

  const handleDownload = async (isHighQuality: boolean = false) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxDimension = isHighQuality ? 3840 : 1280;
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        if (customBackground) {
          const bgImg = new Image();
          bgImg.onload = () => {
            const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
            const x = (canvas.width - bgImg.width * scale) / 2;
            const y = (canvas.height - bgImg.height * scale) / 2;
            ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            
            ctx.drawImage(img, 0, 0, width, height);
            
            if (!isHighQuality && showWatermark) {
              ctx.font = '16px Arial';
              ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.fillText('Remove Background Pro', 10, canvas.height - 10);
            }

            exportImage(canvas, isHighQuality);
          };
          bgImg.src = customBackground;
        } else {
          if (selectedBackground !== 'transparent') {
            ctx.fillStyle = selectedBackground;
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          if (!isHighQuality && showWatermark) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText('Remove Background Pro', 10, canvas.height - 10);
          }

          exportImage(canvas, isHighQuality);
        }
      }
    };

    img.src = editedImage || initialImage;
  };

  const exportImage = (canvas: HTMLCanvasElement, isHighQuality: boolean) => {
    const format = selectedBackground === 'transparent' ? 'image/png' : 'image/jpeg';
    const quality = isHighQuality ? 1.0 : 0.8;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `image-no-bg${format === 'image/png' ? '.png' : '.jpg'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Download complete!",
          description: isHighQuality 
            ? "Image exported in maximum quality" 
            : "Image exported in standard quality",
        });
      }
    }, format, quality);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
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
        <Button
          variant="default"
          className="bg-[#9b87f5] hover:bg-[#8b77e5]"
          onClick={handleQualityDownload}
          disabled={isProcessing || isProcessingAd}
        >
          <Download className="w-4 h-4 mr-2" />
          {isPremiumUser ? t('downloadHighQuality') : t('download')}
        </Button>
      </div>

      {!isProcessing && (
        <ImageActions 
          onUpscale={handleUpscale}
          onCrop={handleCrop}
          onResize={handleResize}
          onEdit={handleEdit}
          isPremium={isPremiumUser}
        />
      )}

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <div 
          className="relative" 
          style={{ 
            backgroundColor: selectedBackground === 'custom' ? 'transparent' : selectedBackground,
            backgroundImage: selectedBackground === 'transparent' ? 
              'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
              customBackground ? `url(${customBackground})` : 'none',
            backgroundSize: selectedBackground === 'transparent' ? '20px 20px' : 'cover',
            backgroundPosition: selectedBackground === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <img
            src={editedImage || initialImage}
            alt="Image being edited"
            className="max-w-full h-auto"
            style={{
              opacity: isProcessing ? 0.5 : 1,
            }}
          />
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mb-2"></div>
              {progress && (
                <div className="text-white bg-black/50 px-4 py-2 rounded-lg">
                  {progress}
                </div>
              )}
            </div>
          )}
          
          {editedImage && showWatermark && (
            <div className="absolute bottom-2 right-2 bg-black/40 text-white px-3 py-1 rounded flex items-center">
              <span className="text-sm mr-2">Remove Background Pro</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-white/20 p-1"
                onClick={handleWatermarkRemoveClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

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
