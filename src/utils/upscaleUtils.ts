
/**
 * Simple utility to upscale images
 * In a real app, this would use ML models or external APIs to upscale images
 */
export const upscaleImage = async (
  imageBlob: Blob, 
  scale: number = 2
): Promise<Blob | null> => {
  try {
    // Validate input blob before processing
    if (!imageBlob || imageBlob.size === 0) {
      console.error('Invalid image blob: empty or null');
      return null;
    }

    // Create an image from the blob
    const img = new Image();
    const imageUrl = URL.createObjectURL(imageBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Create a canvas with the desired dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('Failed to get canvas context');
          URL.revokeObjectURL(imageUrl);
          resolve(null);
          return;
        }
        
        // Set dimensions to upscaled size
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Use built-in browser scaling (not ideal, but works as a placeholder)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob with PNG format for better quality
        canvas.toBlob((resultBlob) => {
          URL.revokeObjectURL(imageUrl);
          if (!resultBlob) {
            console.error('Failed to create result blob');
            resolve(null);
            return;
          }
          resolve(resultBlob);
        }, 'image/png', 1.0); // Using maximum quality
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        URL.revokeObjectURL(imageUrl);
        resolve(null);
      };
      
      // Set crossOrigin to anonymous to handle CORS issues
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error upscaling image:', error);
    return null;
  }
};
