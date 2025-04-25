
import { useState } from 'react';
import { Button } from './ui/button';
import { Eraser, Wand, RotateCcw, Download, Loader } from 'lucide-react';
import { removeBackground } from '../utils/imageUtils';
import { toast } from './ui/use-toast';

interface ImageEditorProps {
  initialImage: string;
  onReset: () => void;
}

const ImageEditor = ({ initialImage, onReset }: ImageEditorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImage || initialImage;
    link.download = 'imagen-sin-fondo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
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
          onClick={handleDownload}
          disabled={isProcessing}
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </Button>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
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
      </div>
    </div>
  );
};

export default ImageEditor;
