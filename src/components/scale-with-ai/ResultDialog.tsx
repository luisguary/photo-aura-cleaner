
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Share2, Upload, Download, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';

interface ResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scaledImage: string | null;
  onDownload: () => void;
  onUploadAnother: () => void;
  onContinue: () => void;
}

export const ResultDialog = ({ 
  isOpen, 
  onOpenChange, 
  scaledImage, 
  onDownload, 
  onUploadAnother, 
  onContinue 
}: ResultDialogProps) => {
  const { t } = useTranslation();

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            {t('share')}
          </Button>
          <Button 
            variant="outline"
            onClick={onUploadAnother}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('uploadImage')}
          </Button>
          <Button 
            onClick={onDownload}
            className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('download')}
          </Button>
          <Button
            onClick={onContinue}
            className="w-full sm:w-auto"
          >
            {t('continue')}
          </Button>
        </DialogFooter>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 rounded-full" 
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
