
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback } from "react";

interface UploadZoneProps {
  onImageSelected: (imageUrl: string) => void;
}

const UploadZone = ({ onImageSelected }: UploadZoneProps) => {
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelected(imageUrl);
    }
  }, [onImageSelected]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelected(imageUrl);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors duration-200 hover:border-[#9b87f5] hover:bg-[#9b87f5]/5"
    >
      <Upload className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Sube tu imagen</h2>
      <p className="text-gray-500 mb-4 text-center">
        Arrastra y suelta una imagen aquí o haz clic para seleccionar
      </p>
      <Button
        variant="default"
        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        Seleccionar Imagen
      </Button>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadZone;
