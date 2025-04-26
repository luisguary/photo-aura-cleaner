
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface WatermarkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onWatchAd: () => void;
  onBePremium: () => void;
}

export const WatermarkDialog = ({ 
  isOpen, 
  onOpenChange, 
  onWatchAd, 
  onBePremium 
}: WatermarkDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
        </div>
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
