
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import { useDeblurImage } from "@/hooks/useDeblurImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "./ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface DeblurButtonProps {
  isPremium: boolean;
  onImageProcessed: (imageUrl: string) => void;
  className?: string;
}

export const DeblurButton = ({ isPremium, onImageProcessed, className }: DeblurButtonProps) => {
  const {
    isProcessing,
    showPremiumDialog,
    setShowPremiumDialog,
    handleDeblurRequest,
    processImage
  } = useDeblurImage({
    isPremium,
    onSuccess: onImageProcessed
  });

  const handleWatchAd = async () => {
    setShowPremiumDialog(false);
    // Simulate ad watching
    toast({
      title: "Loading ad...",
      description: "Please wait while the ad loads"
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        await processImage(imageUrl);
      }
    };
    input.click();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleDeblurRequest}
        disabled={isProcessing}
        className={`bg-[#9b87f5] hover:bg-[#8b77e5] text-white ${className}`}
      >
        <Image className="w-4 h-4 mr-2" />
        Fix Blurry Photo
      </Button>

      {/* Premium/Ad Dialog */}
      <Dialog 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fix Blurry Photo with AI</DialogTitle>
            <DialogDescription>
              Watch an ad to use this feature, or become a Premium user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAd}
            >
              Watch ad to fix photo
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={() => {
                setShowPremiumDialog(false);
                handleDeblurRequest();
              }}
            >
              Become Premium user
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
