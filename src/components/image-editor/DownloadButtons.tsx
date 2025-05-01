
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { DownloadButtonsProps } from '@/types/image-editor';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsMobile } from '@/hooks/use-mobile';

export const DownloadButtons = ({ 
  onDownload, 
  isPremiumUser, 
  isProcessing, 
  isProcessingAd 
}: DownloadButtonsProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Button
      variant="default"
      className="bg-[#9b87f5] hover:bg-[#8b77e5] text-xs md:text-sm"
      onClick={() => onDownload(isPremiumUser)}
      disabled={isProcessing || isProcessingAd}
      size={isMobile ? "sm" : "default"}
    >
      <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
      {isPremiumUser ? t('downloadHighQuality') : t('download')}
    </Button>
  );
};
