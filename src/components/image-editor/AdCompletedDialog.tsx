
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "../ui/alert-dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "../ui/drawer";
import { Button } from "../ui/button";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6 pt-4">
          <DrawerHeader className="text-center">
            <DrawerTitle>{t('adCompleted')}</DrawerTitle>
            <DrawerDescription>
              {t('adCompletedThankYou')}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button onClick={onContinue} className="w-full">
              {t('continue')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

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
