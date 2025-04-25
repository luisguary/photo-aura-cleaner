
import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onImageSelected: (imageUrl: string, fileName: string) => void;
}

const UploadZone = ({ onImageSelected }: UploadZoneProps) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFileName(file.name);
      onImageSelected(imageUrl, file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFileName(file.name);
      onImageSelected(imageUrl, file.name);
    }
  };

  const buttonStyles = selectedFileName 
    ? "bg-[#28A745] hover:bg-[#218838]" 
    : "bg-[#007BFF] hover:bg-[#339CFF]";

  return (
    <div 
      className="flex justify-center items-center w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Button
        variant="default"
        className={`${buttonStyles} px-20 py-6 text-lg flex flex-col items-center justify-center gap-3 w-full max-w-xl text-center text-white font-semibold rounded-lg shadow-md transition-colors duration-300`}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Upload className="w-8 h-8 mb-2" />
        <span className="-mt-2 text-white font-semibold text-center tracking-tight">
          {selectedFileName 
            ? `Imagen seleccionada: ${selectedFileName.length > 20 
                ? selectedFileName.substring(0, 17) + '...' 
                : selectedFileName}`
            : "Seleccionar una imagen para editar"}
        </span>
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
