import React from 'react';
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

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
      onImageSelected(imageUrl);
    }
  };

  return (
    <div 
      className="flex justify-center items-center w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Button
        variant="default"
        className="bg-[#9b87f5] hover:bg-[#8b77e5] px-20 py-6 text-lg flex flex-col items-center justify-center gap-3 w-full max-w-xl text-center"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Upload className="w-8 h-8 mb-2" />
        <span className="-mt-2 text-white font-semibold text-center tracking-tight">Seleccionar una imagen para editar</span>
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
