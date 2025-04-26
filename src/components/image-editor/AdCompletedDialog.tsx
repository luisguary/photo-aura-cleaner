
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../ui/alert-dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface AdCompletedDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export const AdCompletedDialog = ({ 
  isOpen, 
  onOpenChange, 
  onContinue 
}: AdCompletedDialogProps) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('adCompleted')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('adCompletedThankYou')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onContinue}>{t('continue')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
