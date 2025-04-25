
interface EditAdjustments {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  saturation: number; // -100 to 100
  filter: string;     // 'none', 'grayscale', 'sepia', etc.
}

export const applyImageEdits = async (
  imageUrl: string,
  adjustments: EditAdjustments
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
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply adjustments with filters
        ctx.filter = getCanvasFilters(adjustments);
        
        // Draw the edited image
        ctx.drawImage(img, 0, 0);
        
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
      console.error('Error editing image:', error);
      reject(error);
    }
  });
};

const getCanvasFilters = (adjustments: EditAdjustments): string => {
  const filters = [];
  
  if (adjustments.brightness !== 0) {
    filters.push(`brightness(${100 + adjustments.brightness}%)`);
  }
  
  if (adjustments.contrast !== 0) {
    filters.push(`contrast(${100 + adjustments.contrast}%)`);
  }
  
  if (adjustments.saturation !== 0) {
    filters.push(`saturate(${100 + adjustments.saturation}%)`);
  }
  
  if (adjustments.filter !== 'none') {
    switch (adjustments.filter) {
      case 'grayscale':
        filters.push('grayscale(100%)');
        break;
      case 'sepia':
        filters.push('sepia(100%)');
        break;
      case 'invert':
        filters.push('invert(100%)');
        break;
      // Add more filters as needed
    }
  }
  
  return filters.join(' ') || 'none';
};
