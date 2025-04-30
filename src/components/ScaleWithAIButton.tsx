
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowUpCircle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { useScaleImage } from '@/hooks/useScaleImage';
import { ErrorDialog } from './scale-with-ai/ErrorDialog';
import { ResultDialog } from './scale-with-ai/ResultDialog';
import { ProcessingDialog } from './scale-with-ai/ProcessingDialog';

interface ScaleWithAIButtonProps {
  onImageProcessed: (imageUrl: string) => void;
  isPremium: boolean;
}

export const ScaleWithAIButton = ({ onImageProcessed, isPremium }: ScaleWithAIButtonProps) => {
  const { t } = useTranslation();
  const {
    isDialogOpen,
    setIsDialogOpen,
    isResultDialogOpen,
    setIsResultDialogOpen,
    isAdDialogOpen,
    setIsAdDialogOpen,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
    selectedImage,
    scaledImage,
    isProcessing,
    progressPercent,
    handleFileSelected,
    handleDownload,
    handleContinueToApp,
  } = useScaleImage(onImageProcessed, isPremium);

  const handleWatchAd = () => {
    toast({
      title: t('watchingAd'),
      description: t('pleaseWait'),
    });

    setTimeout(() => {
      setIsAdDialogOpen(false);
      if (scaledImage) {
        handleDownload();
        toast({
          title: t('adCompletedThankYou'),
          description: t('downloadStarted'),
        });
      }
    }, 2000);
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
          {t('upscaleWithAI')}
        </Button>
      </motion.div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-[#9b87f5]" /> {t('upscaleWithAI')}
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
                onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                className="hidden"
                disabled={isProcessing}
              />
              <label 
                htmlFor="scale-file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('uploadImage')}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {t('orDragDrop')}
                </p>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <ProcessingDialog isOpen={isProcessing} progress={progressPercent} />

      {/* Result Dialog */}
      <ResultDialog 
        isOpen={isResultDialogOpen}
        onOpenChange={setIsResultDialogOpen}
        scaledImage={scaledImage}
        onDownload={handleDownload}
        onUploadAnother={() => setIsDialogOpen(true)}
        onContinue={handleContinueToApp}
      />

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
      <ErrorDialog
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        onRetry={() => {
          setIsErrorDialogOpen(false);
          setIsDialogOpen(true);
        }}
      />
    </>
  );
};
