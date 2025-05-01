
import { Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { EditDialogContent } from './EditDialogContent';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onEditComplete: (editedImageUrl: string) => void;
}

const EditDialog = ({ open, onOpenChange, imageUrl, onEditComplete }: EditDialogProps) => {
  const isMobile = useIsMobile();

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-8 pt-2 max-h-[85vh] overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4" />
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Image
            </DrawerTitle>
          </DrawerHeader>
          <EditDialogContent
            imageUrl={imageUrl}
            isOpen={open}
            onEditComplete={onEditComplete}
            onCancel={handleCancel}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Image
          </DialogTitle>
        </DialogHeader>
        <EditDialogContent
          imageUrl={imageUrl}
          isOpen={open}
          onEditComplete={onEditComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;

