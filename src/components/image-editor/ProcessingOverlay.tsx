
import { ProcessingOverlayProps } from '@/types/image-editor';

export const ProcessingOverlay = ({ progress }: ProcessingOverlayProps) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mb-2"></div>
    {progress && (
      <div className="text-white bg-black/50 px-4 py-2 rounded-lg">
        {progress}
      </div>
    )}
  </div>
);
