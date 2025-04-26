
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UpscalePremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onBePremium: () => void;
}

export const UpscalePremiumDialog = ({ 
  isOpen, 
  onClose, 
  onWatchAd, 
  onBePremium 
}: UpscalePremiumDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('upscaleImage')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('watchAdToUse')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onWatchAd}
          >
            {t('watchAd')}
          </Button>
          <Button 
            variant="default" 
            className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
            onClick={onBePremium}
          >
            {t('becomePremiumUser')}
          </Button>
        </AlertDialogFooter>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 rounded-full" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
