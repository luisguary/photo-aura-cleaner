
import { useState } from 'react';
import { useWatermark } from './useWatermark';
import { useBackgroundSelection } from './useBackgroundSelection';
import { useImageProcessing } from './useImageProcessing';
import { useDialogs } from './useDialogs';
import { useDownload } from './useDownload';
import { useUpscaleImage } from './useUpscaleImage';

export const useImageEditor = (initialImage: string, fileName: string) => {
  const [isProcessingAd, setIsProcessingAd] = useState(false);

  const {
    showWatermark,
    isWatermarkDialogOpen,
    isPremiumUser,
    setIsWatermarkDialogOpen,
    handleWatermarkRemoveClick,
    handleBePremium,
  } = useWatermark();

  const {
    selectedBackground,
    customBackground,
    setSelectedBackground,
    handleCustomBackground,
  } = useBackgroundSelection();

  const {
    isProcessing: isImageProcessing,
    editedImage,
    progress: imageProgress,
    handleRemoveBackground,
    setEditedImage,
  } = useImageProcessing(initialImage);

  const {
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    isAdWatchedDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setIsAdWatchedDialogOpen,
  } = useDialogs();

  const {
    isQualityDialogOpen,
    isProcessingAd: isDownloadProcessingAd,
    setIsQualityDialogOpen,
    handleQualityDownload,
    handleWatchAdForQuality,
    handleBePremiumForQuality,
    handleDownload,
  } = useDownload({ 
    isPremiumUser, 
    onBePremium: handleBePremium 
  });

  const {
    isProcessing: isUpscaleProcessing,
    progress: upscaleProgress,
    handleUpscale,
  } = useUpscaleImage();

  const handleWatchAd = () => {
    setIsWatermarkDialogOpen(false);
    setIsProcessingAd(true);
    setTimeout(() => {
      setIsProcessingAd(false);
      setIsAdWatchedDialogOpen(true);
    }, 2000);
  };

  const handleAdWatched = () => {
    setIsAdWatchedDialogOpen(false);
  };

  const handleUpscaleRequest = async (scale: number) => {
    const imageToUpscale = editedImage || initialImage;
    const upscaledUrl = await handleUpscale(imageToUpscale, scale);
    if (upscaledUrl) {
      setEditedImage(upscaledUrl);
    }
  };

  const handleDownloadRequest = (isHighQuality: boolean) => {
    handleDownload(editedImage || initialImage, fileName, isHighQuality);
  };

  const handleQualityDownloadRequest = () => {
    handleQualityDownload(handleDownloadRequest);
  };

  const handleWatchAdForQualityRequest = () => {
    handleWatchAdForQuality(handleDownloadRequest);
  };

  const handleBePremiumForQualityRequest = () => {
    handleBePremiumForQuality(handleDownloadRequest);
  };

  const handleCropComplete = (croppedImage: string) => {
    setEditedImage(croppedImage);
    setIsCropDialogOpen(false);
  };

  const handleResizeComplete = (resizedImage: string) => {
    setEditedImage(resizedImage);
    setIsResizeDialogOpen(false);
  };

  const handleEditComplete = (editedImg: string) => {
    setEditedImage(editedImg);
    setIsEditDialogOpen(false);
  };

  return {
    isProcessing: isImageProcessing || isUpscaleProcessing,
    editedImage,
    progress: imageProgress || upscaleProgress,
    selectedBackground,
    customBackground,
    showWatermark,
    isWatermarkDialogOpen,
    isAdWatchedDialogOpen,
    isPremiumUser,
    isQualityDialogOpen,
    isProcessingAd: isProcessingAd || isDownloadProcessingAd,
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    setIsWatermarkDialogOpen,
    setIsQualityDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setSelectedBackground,
    handleRemoveBackground,
    handleUpscaleRequest,
    handleWatermarkRemoveClick,
    handleWatchAd,
    handleAdWatched,
    handleBePremium,
    handleQualityDownloadRequest,
    handleWatchAdForQualityRequest,
    handleBePremiumForQualityRequest,
    handleCustomBackground,
    handleCropComplete,
    handleResizeComplete,
    handleEditComplete,
  };
};
