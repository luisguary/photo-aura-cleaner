
import React from 'react';
import { Button } from "./ui/button";
import { Crop, MinusCircle, Edit, ZoomIn } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ImageActionsProps {
  onCrop: () => void;
  onResize: () => void;
  onEdit: () => void;
  onUpscale?: () => void;
  isPremium: boolean;
}

const ImageActions: React.FC<ImageActionsProps> = ({ 
  onCrop, 
  onResize, 
  onEdit,
  onUpscale,
  isPremium 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline"
        onClick={onCrop}
        className="flex items-center"
      >
        <Crop className="w-4 h-4 mr-2" />
        {t('cropImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onResize}
        className="flex items-center"
      >
        <MinusCircle className="w-4 h-4 mr-2" />
        {t('resizeImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        className="flex items-center"
      >
        <Edit className="w-4 h-4 mr-2" />
        {t('editImage')}
      </Button>
      {onUpscale && (
        <Button 
          variant="outline"
          onClick={onUpscale}
          className="flex items-center"
        >
          <ZoomIn className="w-4 h-4 mr-2" />
          {t('upscaleImage')}
        </Button>
      )}
    </div>
  );
};

export default ImageActions;
