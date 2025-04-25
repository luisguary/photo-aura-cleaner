import { useState } from 'react';
import { Button } from './ui/button';
import { Eraser, RotateCcw, Download, Loader, X } from 'lucide-react';
import { removeBackground } from '../utils/imageUtils';
import { toast } from './ui/use-toast';
import BackgroundSelector from './BackgroundSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface ImageEditorProps {
  initialImage: string;
  onReset: () => void;
}

const ImageEditor = ({ initialImage, onReset }: ImageEditorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [selectedBackground, setSelectedBackground] = useState<string>('transparent');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isWatermarkDialogOpen, setIsWatermarkDialogOpen] = useState(false);
  const [isAdWatchedDialogOpen, setIsAdWatchedDialogOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  const handleRemoveBackground = async () => {
    try {
      setIsProcessing(true);
      setProgress('Procesando imagen...');
      toast({
        title: "Procesando imagen...",
        description: "Esto puede tomar unos segundos.",
      });

      const img = new Image();
      img.src = initialImage;
      await new Promise((resolve) => (img.onload = resolve));

      const resultBlob = await removeBackground(img);
      const resultUrl = URL.createObjectURL(resultBlob);
      setEditedImage(resultUrl);

      toast({
        title: "¡Listo!",
        description: "El fondo ha sido removido exitosamente",
      });
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al procesar la imagen. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  const handleWatermarkRemoveClick = () => {
    if (isPremiumUser) {
      setShowWatermark(false);
      toast({
        title: "Usuario Premium",
        description: "Marca de agua eliminada automáticamente",
      });
    } else {
      setIsWatermarkDialogOpen(true);
    }
  };

  const handleWatchAd = () => {
    setIsWatermarkDialogOpen(false);
    setProgress('Cargando anuncio...');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProgress('');
      setIsAdWatchedDialogOpen(true);
    }, 2000);
  };

  const handleAdWatched = () => {
    setIsAdWatchedDialogOpen(false);
    setShowWatermark(false);
    toast({
      title: "¡Gracias!",
      description: "Marca de agua eliminada correctamente",
    });
  };

  const handleBePremium = () => {
    setIsWatermarkDialogOpen(false);
    setIsPremiumUser(true);
    setShowWatermark(false);
    toast({
      title: "¡Bienvenido a Premium!",
      description: "Ahora eres usuario Premium y no verás marcas de agua",
    });
  };

  const handleDownload = async (isHighQuality: boolean = false) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxDimension = isHighQuality ? 3840 : 1280;
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        if (customBackground) {
          const bgImg = new Image();
          bgImg.onload = () => {
            const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
            const x = (canvas.width - bgImg.width * scale) / 2;
            const y = (canvas.height - bgImg.height * scale) / 2;
            ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            
            ctx.drawImage(img, 0, 0, width, height);
            
            if (!isHighQuality && showWatermark) {
              ctx.font = '16px Arial';
              ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.fillText('Quitar Fondo Pro', 10, canvas.height - 10);
            }

            exportImage(canvas, isHighQuality);
          };
          bgImg.src = customBackground;
        } else {
          if (selectedBackground !== 'transparent') {
            ctx.fillStyle = selectedBackground;
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          if (!isHighQuality && showWatermark) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText('Quitar Fondo Pro', 10, canvas.height - 10);
          }

          exportImage(canvas, isHighQuality);
        }
      }
    };

    img.src = editedImage || initialImage;
  };

  const exportImage = (canvas: HTMLCanvasElement, isHighQuality: boolean) => {
    const format = selectedBackground === 'transparent' ? 'image/png' : 'image/jpeg';
    const quality = isHighQuality ? 1.0 : 0.8;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `imagen-sin-fondo${format === 'image/png' ? '.png' : '.jpg'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "¡Descarga completada!",
          description: isHighQuality 
            ? "Imagen exportada en máxima calidad" 
            : "Imagen exportada en calidad estándar",
        });
      }
    }, format, quality);
  };

  const handleQualityDownload = () => {
    if (isPremiumUser) {
      handleDownload(true);
    } else {
      setIsQualityDialogOpen(true);
    }
  };

  const handleWatchAdForQuality = () => {
    setIsQualityDialogOpen(false);
    setIsProcessingAd(true);
    setProgress('Cargando anuncio...');
    
    setTimeout(() => {
      setIsProcessingAd(false);
      setProgress('');
      handleDownload(true);
      toast({
        title: "¡Gracias por ver el anuncio!",
        description: "Tu imagen se descargará en máxima calidad",
      });
    }, 2000);
  };

  const handleBePremiumForQuality = () => {
    setIsQualityDialogOpen(false);
    setIsPremiumUser(true);
    handleDownload(true);
    toast({
      title: "¡Bienvenido a Premium!",
      description: "Ahora puedes descargar todas tus imágenes en máxima calidad",
    });
  };

  const handleCustomBackground = (imageUrl: string) => {
    setCustomBackground(imageUrl);
    setSelectedBackground('custom');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eraser className="w-4 h-4 mr-2" />
          )}
          Remover Fondo
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar
        </Button>
        <Button
          variant="default"
          className="bg-[#9b87f5] hover:bg-[#8b77e5]"
          onClick={handleQualityDownload}
          disabled={isProcessing || isProcessingAd}
        >
          <Download className="w-4 h-4 mr-2" />
          {isPremiumUser ? 'Descargar en Alta Calidad' : 'Descargar'}
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <div 
          className="relative" 
          style={{ 
            backgroundColor: selectedBackground === 'custom' ? 'transparent' : selectedBackground,
            backgroundImage: selectedBackground === 'transparent' ? 
              'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
              customBackground ? `url(${customBackground})` : 'none',
            backgroundSize: selectedBackground === 'transparent' ? '20px 20px' : 'cover',
            backgroundPosition: selectedBackground === 'transparent' ? '0 0, 0 10px, 10px -10px, -10px 0px' : 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <img
            src={editedImage || initialImage}
            alt="Imagen siendo editada"
            className="max-w-full h-auto"
            style={{
              opacity: isProcessing ? 0.5 : 1,
            }}
          />
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mb-2"></div>
              {progress && (
                <div className="text-white bg-black/50 px-4 py-2 rounded-lg">
                  {progress}
                </div>
              )}
            </div>
          )}
          
          {editedImage && showWatermark && (
            <div className="absolute bottom-2 right-2 bg-black/40 text-white px-3 py-1 rounded flex items-center">
              <span className="text-sm mr-2">Quitar Fondo Pro</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full hover:bg-white/20 p-1"
                onClick={handleWatermarkRemoveClick}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {editedImage && (
        <BackgroundSelector
          selectedBackground={selectedBackground}
          onSelectBackground={setSelectedBackground}
          onSelectCustomBackground={handleCustomBackground}
        />
      )}

      <Dialog open={isWatermarkDialogOpen} onOpenChange={setIsWatermarkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar marca de agua</DialogTitle>
            <DialogDescription>
              Mira un anuncio para eliminar la marca de agua, o hazte usuario Premium.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAd}
            >
              Ver anuncio para quitar marca de agua
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremium}
            >
              Hazte usuario Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQualityDialogOpen} onOpenChange={setIsQualityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Descarga en Alta Calidad</DialogTitle>
            <DialogDescription>
              ¿Quieres descargar la imagen en máxima calidad sin marca de agua? 
              Mira un anuncio o hazte Premium.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleWatchAdForQuality}
            >
              Ver anuncio para descarga en alta calidad
            </Button>
            <Button 
              variant="default" 
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]" 
              onClick={handleBePremiumForQuality}
            >
              Hazte usuario Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAdWatchedDialogOpen} onOpenChange={setIsAdWatchedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Anuncio completado!</AlertDialogTitle>
            <AlertDialogDescription>
              Gracias por ver el anuncio. La marca de agua será eliminada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAdWatched}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageEditor;
