
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { DownloadButtonsProps } from '@/types/image-editor';
import { useTranslation } from '@/hooks/useTranslation';

export const DownloadButtons = ({ 
  onDownload, 
  isPremiumUser, 
  isProcessing, 
  isProcessingAd 
}: DownloadButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="default"
      className="bg-[#9b87f5] hover:bg-[#8b77e5]"
      onClick={() => onDownload(isPremiumUser)}
      disabled={isProcessing || isProcessingAd}
    >
      <Download className="w-4 h-4 mr-2" />
      {isPremiumUser ? t('downloadHighQuality') : t('download')}
    </Button>
  );
};
