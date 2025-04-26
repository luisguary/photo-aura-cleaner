
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { useTranslation } from '@/hooks/useTranslation';

interface ProcessingDialogProps {
  isOpen: boolean;
  progress: number;
}

export const ProcessingDialog = ({ isOpen, progress }: ProcessingDialogProps) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('processingImage')}</DialogTitle>
          <DialogDescription>
            {t('pleaseWait')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-gray-500 mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
