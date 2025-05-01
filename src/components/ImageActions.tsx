
import React from 'react';
import { Button } from "./ui/button";
import { Crop, MinusCircle, Edit, ZoomIn } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-wrap gap-2 mt-2 md:mt-4">
      <Button 
        variant="outline"
        onClick={onCrop}
        className="flex items-center text-xs md:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <Crop className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        {t('cropImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onResize}
        className="flex items-center text-xs md:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <MinusCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        {t('resizeImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        className="flex items-center text-xs md:text-sm"
        size={isMobile ? "sm" : "default"}
      >
        <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
        {t('editImage')}
      </Button>
      {onUpscale && (
        <Button 
          variant="outline"
          onClick={onUpscale}
          className="flex items-center text-xs md:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <ZoomIn className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          {t('upscaleImage')}
        </Button>
      )}
    </div>
  );
};

export default ImageActions;
