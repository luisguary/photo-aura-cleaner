
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "./ui/button";
import { ArrowUpCircle, Crop, MinusCircle, Edit, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface ImageActionsProps {
  onUpscale: (scale: number) => void;
  onCrop: () => void;
  onResize: () => void;
  onEdit: () => void;
  isPremium: boolean;
}

const ImageActions: React.FC<ImageActionsProps> = ({ 
  onUpscale, 
  onCrop, 
  onResize, 
  onEdit,
  isPremium 
}) => {
  const [isUpscaleDialogOpen, setIsUpscaleDialogOpen] = useState(false);
  const [isUpscalePremiumDialogOpen, setIsUpscalePremiumDialogOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState<number>(2);
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  // Function to reset all states related to upscaling
  const resetUpscaleStates = useCallback(() => {
    setIsProcessingAd(false);
    setIsUpscaleDialogOpen(false);
    setIsUpscalePremiumDialogOpen(false);
  }, []);

  // Effect to make sure the component state is reset when unmounted
  useEffect(() => {
    return () => {
      resetUpscaleStates();
    };
  }, [resetUpscaleStates]);

  const handleUpscaleClick = () => {
    setIsUpscaleDialogOpen(true);
  };

  const handleScaleSelect = (scale: number) => {
    setSelectedScale(scale);
    if (isPremium) {
      setIsUpscaleDialogOpen(false);
      onUpscale(scale);
      toast({
        title: "Upscaling Image",
        description: `Upscaling image to ${scale}x its original size...`,
      });
    } else {
      setIsUpscaleDialogOpen(false);
      setIsUpscalePremiumDialogOpen(true);
    }
  };

  const handleWatchAd = () => {
    setIsProcessingAd(true);
    setIsUpscalePremiumDialogOpen(false);
    
    toast({
      title: "Loading ad...",
      description: "Please wait while the ad loads",
    });

    // Simulate ad watching
    setTimeout(() => {
      setIsProcessingAd(false);
      onUpscale(selectedScale);
      toast({
        title: "Thanks for watching the ad!",
        description: `Upscaling image to ${selectedScale}x its original size...`,
      });
    }, 2000);
  };

  const handleBePremium = () => {
    setIsUpscalePremiumDialogOpen(false);
    onUpscale(selectedScale);
    toast({
      title: "Welcome to Premium!",
      description: `Upscaling image to ${selectedScale}x its original size...`,
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline"
        onClick={handleUpscaleClick}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <ArrowUpCircle className="w-4 h-4 mr-2" />
        Upscale with AI
      </Button>
      <Button 
        variant="outline"
        onClick={onCrop}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Crop className="w-4 h-4 mr-2" />
        Crop Image
      </Button>
      <Button 
        variant="outline"
        onClick={onResize}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <MinusCircle className="w-4 h-4 mr-2" />
        Resize Image
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Image
      </Button>

      {/* First dialog - Upscale selection */}
      <Dialog 
        open={isUpscaleDialogOpen} 
        onOpenChange={(open) => {
          setIsUpscaleDialogOpen(open);
          // If dialog is closed, reset states
          if (!open) {
            resetUpscaleStates();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upscale Image with AI</DialogTitle>
            <DialogDescription>
              Choose how much you want to upscale your image:
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => handleScaleSelect(2)}
            >
              Upscale 2x
            </Button>
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => handleScaleSelect(4)}
            >
              Upscale 4x
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Second dialog - Premium/Ad options */}
      <AlertDialog 
        open={isUpscalePremiumDialogOpen} 
        onOpenChange={(open) => {
          setIsUpscalePremiumDialogOpen(open);
          // When dialog is closed, reset all states to restore app functionality
          if (!open) {
            resetUpscaleStates();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upscale Image with Artificial Intelligence</AlertDialogTitle>
            <AlertDialogDescription>
              Watch an ad to upscale your image, or become a Premium user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAd}
            >
              Watch Ad
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremium}
            >
              Become Premium
            </Button>
          </AlertDialogFooter>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full" 
            onClick={() => resetUpscaleStates()}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageActions;
