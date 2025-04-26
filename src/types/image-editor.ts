
export interface ImageEditorProps {
  initialImage: string;
  fileName: string;
  onReset: () => void;
}

export interface WatermarkProps {
  onRemove: () => void;
  showRemoveButton?: boolean;
}

export interface ProcessingOverlayProps {
  progress: string;
}

export interface ImagePreviewProps {
  image: string;
  isProcessing: boolean;
  progress: string;
  showWatermark: boolean;
  selectedBackground: string;
  customBackground: string | null;
  onWatermarkRemove: () => void;
}

export interface DownloadButtonsProps {
  onDownload: (isHighQuality: boolean) => void;
  isPremiumUser: boolean;
  isProcessing: boolean;
  isProcessingAd: boolean;
}
