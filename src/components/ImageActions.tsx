
import React from 'react';
import { Button } from "./ui/button";
import { ArrowUpCircle, Crop, MinusCircle, Edit } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useImageUpscale } from "@/hooks/useImageUpscale";
import { UpscaleDialog } from "./image-actions/UpscaleDialog";
import { UpscalePremiumDialog } from "./image-actions/UpscalePremiumDialog";

interface ImageActionsProps {
  onUpscale: (scale: number) => void;
  onCrop: () => void;
  onResize: () => void;
  onEdit: () => void;
  isPremium: boolean;
}

const ImageActions: React.FC<ImageActionsProps> = ({ 
  onUpscale, 
  onCrop, 
  onResize, 
  onEdit,
  isPremium 
}) => {
  const { t } = useTranslation();
  
  const {
    isUpscaleDialogOpen,
    isUpscalePremiumDialogOpen,
    isProcessingAd,
    handleUpscaleClick,
    handleScaleSelect,
    handleWatchAd,
    handleBePremium,
    setIsUpscaleDialogOpen,
    setIsUpscalePremiumDialogOpen,
    resetUpscaleStates
  } = useImageUpscale({ onUpscale, isPremium });

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline"
        onClick={handleUpscaleClick}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <ArrowUpCircle className="w-4 h-4 mr-2" />
        {t('upscaleWithAI')}
      </Button>
      <Button 
        variant="outline"
        onClick={onCrop}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Crop className="w-4 h-4 mr-2" />
        {t('cropImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onResize}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <MinusCircle className="w-4 h-4 mr-2" />
        {t('resizeImage')}
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        disabled={isProcessingAd}
        className="flex items-center"
      >
        <Edit className="w-4 h-4 mr-2" />
        {t('editImage')}
      </Button>

      <UpscaleDialog 
        isOpen={isUpscaleDialogOpen}
        onClose={() => setIsUpscaleDialogOpen(false)}
        onScaleSelect={handleScaleSelect}
      />

      <UpscalePremiumDialog
        isOpen={isUpscalePremiumDialogOpen}
        onClose={() => {
          setIsUpscalePremiumDialogOpen(false);
          resetUpscaleStates();
        }}
        onWatchAd={handleWatchAd}
        onBePremium={handleBePremium}
      />
    </div>
  );
};

export default ImageActions;
