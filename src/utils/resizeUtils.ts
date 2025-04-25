
import { toast } from "@/components/ui/use-toast";

interface ResizeOptions {
  width?: number;
  height?: number;
  percentage?: number;
}

export const resizeImage = async (
  imageUrl: string,
  options: ResizeOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not create canvas context');
        }
        
        let newWidth: number;
        let newHeight: number;
        
        if (options.percentage) {
          // Resize by percentage
          newWidth = img.width * (options.percentage / 100);
          newHeight = img.height * (options.percentage / 100);
        } else if (options.width && options.height) {
          // Use specific dimensions
          newWidth = options.width;
          newHeight = options.height;
        } else if (options.width) {
          // Calculate height proportionally from width
          const ratio = img.width / img.height;
          newWidth = options.width;
          newHeight = options.width / ratio;
        } else if (options.height) {
          // Calculate width proportionally from height
          const ratio = img.width / img.height;
          newWidth = options.height * ratio;
          newHeight = options.height;
        } else {
          // No valid resize option provided
          throw new Error('Invalid resize options');
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
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
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    } catch (error) {
      console.error('Error resizing image:', error);
      reject(error);
    }
  });
};
