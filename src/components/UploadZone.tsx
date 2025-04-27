
import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useStoragePermission } from "@/hooks/useStoragePermission";
import { Capacitor } from '@capacitor/core';

interface UploadZoneProps {
  onImageSelected: (imageUrl: string, fileName: string) => void;
}

const UploadZone = ({ onImageSelected }: UploadZoneProps) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { t } = useTranslation();
  const { checkAndRequestPermissions, isRequestingPermission } = useStoragePermission();
  const isMobileDevice = Capacitor.isNativePlatform();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // En dispositivos móviles, verificar permisos primero
    if (isMobileDevice) {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        return;
      }
    }

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
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // En dispositivos móviles, verificar permisos primero
    if (isMobileDevice) {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        return;
      }
    }
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFileName(file.name);
      onImageSelected(imageUrl, file.name);
    }
  };

  const handleButtonClick = async () => {
    // En dispositivos móviles, verificar permisos primero
    if (isMobileDevice) {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        return;
      }
    }

    document.getElementById('fileInput')?.click();
  };

  return (
    <div 
      className="flex justify-center items-center w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Button
        variant="default"
        size="lg"
        className={`
          relative overflow-hidden
          ${isDragging ? 'ring-2 ring-primary' : ''} 
          px-8 py-6 h-auto
          w-full max-w-xl
          bg-[#9b87f5] hover:bg-[#8b77e5] active:bg-[#7e69ab]
          transition-all duration-200
          shadow-lg hover:shadow-xl
          flex items-center justify-center gap-4
          text-base sm:text-lg font-medium text-white
          rounded-lg
        `}
        onClick={handleButtonClick}
        disabled={isRequestingPermission}
      >
        <Upload className="w-6 h-6 flex-shrink-0" />
        <span className="truncate">
          {isRequestingPermission ? t('requestingPermissions') : 
            selectedFileName 
              ? `Selected: ${selectedFileName.length > 20 
                  ? selectedFileName.substring(0, 17) + '...' 
                  : selectedFileName}`
              : t('selectImageToEdit')}
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
