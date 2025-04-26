
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Progress } from './ui/progress';
import { ArrowUpCircle, Download, X, Share2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { useUpscaleImage } from '@/hooks/useUpscaleImage';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from './ui/alert-dialog';

interface ScaleWithAIButtonProps {
  onImageProcessed: (imageUrl: string) => void;
  isPremium: boolean;
}

export const ScaleWithAIButton = ({ onImageProcessed, isPremium }: ScaleWithAIButtonProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scaledImage, setScaledImage] = useState<string | null>(null);
  const { isProcessing, progress, handleUpscale } = useUpscaleImage();
  const [progressPercent, setProgressPercent] = useState(0);

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      startProcessing(imageUrl);
    }
  };

  const startProcessing = async (imageUrl: string) => {
    toast({
      title: t('processingImage'),
      description: t('pleaseWait'),
    });

    // Simulate progress
    const interval = setInterval(() => {
      setProgressPercent(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 500);

    try {
      const result = await handleUpscale(imageUrl, 2);
      clearInterval(interval);
      setProgressPercent(100);
      
      if (result) {
        setScaledImage(result);
        setIsResultDialogOpen(true);
      } else {
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      clearInterval(interval);
      console.error('Error processing image:', error);
      setIsErrorDialogOpen(true);
    }
  };

  const handleDownload = () => {
    if (!scaledImage) return;
    
    if (isPremium) {
      downloadImage(scaledImage);
      setIsResultDialogOpen(false);
    } else {
      setIsAdDialogOpen(true);
    }
  };

  const handleWatchAd = () => {
    toast({
      title: t('watchingAd'),
      description: t('pleaseWait'),
    });

    // Simulate ad watching
    setTimeout(() => {
      setIsAdDialogOpen(false);
      if (scaledImage) {
        downloadImage(scaledImage);
        toast({
          title: t('adCompletedThankYou'),
          description: t('downloadStarted'),
        });
      }
    }, 2000);
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scaled-image.jpg';
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

  const handleContinueToApp = () => {
    if (scaledImage) {
      onImageProcessed(scaledImage);
      setIsResultDialogOpen(false);
    }
  };

  const handleRetry = () => {
    setIsErrorDialogOpen(false);
    setIsDialogOpen(true);
  };

  const handleShare = () => {
    if (navigator.share && scaledImage) {
      navigator.share({
        title: 'Imagen Escalada',
        text: 'Mira esta imagen que acabo de escalar con IA',
        url: scaledImage,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast({
        title: "Compartir no disponible",
        description: "Esta función no está disponible en tu dispositivo",
      });
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white p-4 flex items-center justify-center gap-2"
        >
          <ArrowUpCircle className="w-5 h-5" />
          Escalar con IA
        </Button>
      </motion.div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-[#9b87f5]" /> Escalar con IA
            </DialogTitle>
            <DialogDescription>
              {t('selectImageToEnhance')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                id="scale-file-input"
                onChange={handleFileSelected}
                className="hidden"
                disabled={isProcessing}
              />
              <label 
                htmlFor="scale-file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Haz clic para seleccionar una imagen
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  O arrastra y suelta aquí
                </p>
              </label>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full" 
            onClick={() => setIsDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Procesando Imagen</DialogTitle>
            <DialogDescription>
              {progress || t('processingImage')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Progress value={progressPercent} className="w-full" />
            <p className="text-center text-sm text-gray-500 mt-2">
              {Math.round(progressPercent)}%
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('imageEnhanced')}</DialogTitle>
            <DialogDescription>
              {t('imageEnhancedDescription')}
            </DialogDescription>
          </DialogHeader>
          {scaledImage && (
            <div className="py-4">
              <img 
                src={scaledImage} 
                alt="Scaled" 
                className="w-full h-auto rounded-md shadow-md" 
              />
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              onClick={handleShare}
              className="w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Escalar otra
            </Button>
            <Button 
              onClick={handleDownload}
              className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#8b77e5]"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
            <Button
              onClick={handleContinueToApp}
              className="w-full sm:w-auto"
            >
              Continuar
            </Button>
          </DialogFooter>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full" 
            onClick={() => setIsResultDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogContent>
      </Dialog>

      {/* Ad Dialog */}
      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('watchAdToDownload')}</DialogTitle>
            <DialogDescription>
              {t('watchAdToRemoveWatermark')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button 
              onClick={handleWatchAd}
              className="w-full"
            >
              {t('watchAd')}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/pricing'}
              className="w-full"
            >
              {t('becomePremiumUser')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('error')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('scalingError')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRetry}>{t('retry')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
