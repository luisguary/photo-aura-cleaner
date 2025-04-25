
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { ArrowUpCircle, Crop, MinusCircle, Edit } from "lucide-react";
import { toast } from "./ui/use-toast";
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

  const handleUpscaleClick = () => {
    setIsUpscaleDialogOpen(true);
  };

  const handleScaleSelect = (scale: number) => {
    setSelectedScale(scale);
    if (isPremium) {
      setIsUpscaleDialogOpen(false);
      onUpscale(scale);
      toast({
        title: "Ampliando imagen",
        description: `Ampliando imagen a ${scale}x su tamaño original...`,
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
      title: "Cargando anuncio...",
      description: "Espera mientras se carga el anuncio",
    });

    // Simulate ad watching
    setTimeout(() => {
      setIsProcessingAd(false);
      onUpscale(selectedScale);
      toast({
        title: "¡Gracias por ver el anuncio!",
        description: `Ampliando imagen a ${selectedScale}x su tamaño original...`,
      });
    }, 2000);
  };

  const handleBePremium = () => {
    setIsUpscalePremiumDialogOpen(false);
    onUpscale(selectedScale);
    toast({
      title: "¡Bienvenido a Premium!",
      description: `Ampliando imagen a ${selectedScale}x su tamaño original...`,
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
        Ampliar con IA
      </Button>
      <Button 
        variant="outline"
        onClick={onCrop}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Crop className="w-4 h-4 mr-2" />
        Cortar imagen
      </Button>
      <Button 
        variant="outline"
        onClick={onResize}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <MinusCircle className="w-4 h-4 mr-2" />
        Reducir tamaño
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar imagen
      </Button>

      <Dialog open={isUpscaleDialogOpen} onOpenChange={setIsUpscaleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ampliar imagen con IA</DialogTitle>
            <DialogDescription>
              Elige cuánto quieres ampliar tu imagen:
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => handleScaleSelect(2)}
            >
              Ampliar 2x
            </Button>
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => handleScaleSelect(4)}
            >
              Ampliar 4x
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isUpscalePremiumDialogOpen} onOpenChange={setIsUpscalePremiumDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ampliar imagen</AlertDialogTitle>
            <AlertDialogDescription>
              Mira un anuncio para ampliar tu imagen a {selectedScale}x, o hazte usuario Premium.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAd}
            >
              Ver anuncio
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremium}
            >
              Hazte Premium
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageActions;
