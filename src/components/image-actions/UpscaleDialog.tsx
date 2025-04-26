
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface UpscaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScaleSelect: (scale: number) => void;
}

export const UpscaleDialog = ({ isOpen, onClose, onScaleSelect }: UpscaleDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('upscaleImage')}</DialogTitle>
          <DialogDescription>
            {t('chooseUpscaleAmount')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => onScaleSelect(2)}
          >
            {t('upscale2x')}
          </Button>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => onScaleSelect(4)}
          >
            {t('upscale4x')}
          </Button>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
