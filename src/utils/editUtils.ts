
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
      img.crossOrigin = "anonymous";  // Add this to prevent CORS issues
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

// Utility function to create a preview URL from settings without creating a blob
export const generatePreviewUrl = (imageUrl: string, adjustments: EditAdjustments): string => {
  // Create an inline SVG that applies CSS filters to the image
  const filterValue = getCanvasFilters(adjustments);
  const encodedImage = encodeURIComponent(imageUrl);
  
  // Create a data URL with SVG that applies filters to the embedded image
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <image filter="url(#filter)" xlink:href="${encodedImage}" width="100%" height="100%" />
      <filter id="filter">
        <feComponentTransfer>
          ${adjustments.brightness !== 0 ? 
            `<feFuncR type="linear" slope="${1 + adjustments.brightness/100}" intercept="0" />
             <feFuncG type="linear" slope="${1 + adjustments.brightness/100}" intercept="0" />
             <feFuncB type="linear" slope="${1 + adjustments.brightness/100}" intercept="0" />` : ''}
        </feComponentTransfer>
        ${adjustments.contrast !== 0 ? `<feColorMatrix type="saturate" values="${1 + adjustments.contrast/100}"/>` : ''}
        ${adjustments.saturation !== 0 ? `<feColorMatrix type="saturate" values="${1 + adjustments.saturation/100}"/>` : ''}
        ${adjustments.filter === 'grayscale' ? '<feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0"/>' : ''}
        ${adjustments.filter === 'sepia' ? '<feColorMatrix type="matrix" values="0.393 0.769 0.189 0 0 0.349 0.686 0.168 0 0 0.272 0.534 0.131 0 0 0 0 0 1 0"/>' : ''}
      </filter>
    </svg>
  `;
  
  // Inline CSS filter as backup approach
  const style = document.createElement('style');
  style.innerHTML = `
    .filtered-image {
      filter: ${filterValue};
    }
  `;
  document.head.appendChild(style);
  
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};
