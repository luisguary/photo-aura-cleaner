
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';
import { useTranslation } from '@/hooks/useTranslation';

interface ErrorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
}

export const ErrorDialog = ({ isOpen, onOpenChange, onRetry }: ErrorDialogProps) => {
  const { t } = useTranslation();
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('error')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('scalingError')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onRetry}>{t('retry')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
