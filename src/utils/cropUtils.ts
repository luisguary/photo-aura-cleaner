
import { toast } from "@/components/ui/use-toast";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const cropImage = (
  image: HTMLImageElement,
  cropArea: CropArea
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }
      
      // Set canvas dimensions to the cropped area size
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      
      // Draw the cropped portion of the image
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/png',
        1.0
      );
    } catch (error) {
      console.error('Error cropping image:', error);
      reject(error);
    }
  });
};

// Helper to load image from URL
export const loadImageFromUrl = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};
