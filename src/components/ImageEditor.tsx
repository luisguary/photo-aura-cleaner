
import { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Wand, RotateCcw, Download, SlidersHorizontal } from 'lucide-react';
import { removeBackground } from '../utils/imageUtils';
import { toast } from '../components/ui/use-toast';
import { Progress } from './ui/progress';

interface ImageEditorProps {
  initialImage: string;
  onReset: () => void;
}

const ImageEditor = ({ initialImage, onReset }: ImageEditorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [compareValue, setCompareValue] = useState(50);

  const handleRemoveBackground = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      toast({
        title: "Procesando imagen...",
        description: "Cargando modelos de AI. Este proceso puede tomar hasta 30 segundos la primera vez.",
      });
      
      // Simular progreso mientras se carga el modelo
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return prev;
          }
          return Math.min(prev + 5, 90);
        });
      }, 1000);

      const img = new Image();
      img.src = initialImage;
      await new Promise((resolve) => (img.onload = resolve));

      const resultBlob = await removeBackground(img);
      clearInterval(progressInterval);
      setProgress(100);
      
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
        description: "No se pudo procesar la imagen. Por favor, intente con otra imagen o actualice la página.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'imagen-sin-fondo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleRemoveBackground}
          disabled={isProcessing}
        >
          <Wand className="w-4 h-4 mr-2" />
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
        {editedImage && (
          <Button
            variant="default"
            className="bg-[#9b87f5] hover:bg-[#8b77e5]"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        )}
      </div>

      {isProcessing && (
        <div className="w-full space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground text-center">
            Procesando imagen... {progress}%
            {progress < 30 && " (Cargando modelo AI)"}
            {progress >= 30 && progress < 70 && " (Analizando imagen)"}
            {progress >= 70 && progress < 95 && " (Eliminando fondo)"}
            {progress >= 95 && " (Finalizando)"}
          </p>
        </div>
      )}

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {editedImage ? (
          <div className="relative w-full aspect-video">
            <div className="absolute inset-0">
              <img
                src={initialImage}
                alt="Imagen original"
                className="w-full h-full object-contain"
              />
            </div>
            <div 
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }}
            >
              <img
                src={editedImage}
                alt="Imagen procesada"
                className="w-full h-full object-contain"
              />
            </div>
            {editedImage && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center items-center">
                <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                    <Slider
                      value={[compareValue]}
                      onValueChange={([value]) => setCompareValue(value)}
                      max={100}
                      step={1}
                      className="w-[200px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={initialImage}
            alt="Imagen siendo editada"
            className="w-full h-auto"
            style={{
              opacity: isProcessing ? 0.5 : 1,
            }}
          />
        )}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
