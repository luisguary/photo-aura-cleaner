
import { useState } from 'react';

export const useDialogs = () => {
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isResizeDialogOpen, setIsResizeDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
  const [isAdWatchedDialogOpen, setIsAdWatchedDialogOpen] = useState(false);

  return {
    isCropDialogOpen,
    isResizeDialogOpen,
    isEditDialogOpen,
    isQualityDialogOpen,
    isAdWatchedDialogOpen,
    setIsCropDialogOpen,
    setIsResizeDialogOpen,
    setIsEditDialogOpen,
    setIsQualityDialogOpen,
    setIsAdWatchedDialogOpen,
  };
};
