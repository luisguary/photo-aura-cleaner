
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
      className="flex justify-center items-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Button
        variant="default"
        className="bg-[#9b87f5] hover:bg-[#8b77e5] px-6 py-4 text-base flex flex-col gap-1"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <Upload className="w-6 h-6" />
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
