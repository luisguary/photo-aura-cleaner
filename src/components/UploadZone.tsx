
import { Image } from "lucide-react";
import { Button } from "./ui/button";

interface UploadZoneProps {
  onImageSelected: (imageUrl: string) => void;
}

const UploadZone = ({ onImageSelected }: UploadZoneProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelected(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
      <Image className="w-12 h-12 text-gray-400" />
      <h2 className="text-lg font-semibold text-center">Sube tu imagen</h2>
      <p className="text-sm text-gray-500 text-center mb-2">
        Arrastra y suelta una imagen aquí o haz clic para seleccionar
      </p>
      <Button
        variant="default"
        className="bg-[#9b87f5] hover:bg-[#8b77e5] mt-2"
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

