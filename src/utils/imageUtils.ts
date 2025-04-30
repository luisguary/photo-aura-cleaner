
const MAX_IMAGE_DIMENSION = 1024;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal with Remove.bg API...');
    
    // Validate input more strictly
    if (!imageElement || !imageElement.complete || imageElement.naturalWidth === 0) {
      console.error('Invalid image element or image not fully loaded');
      throw new Error('Invalid image element or image not fully loaded');
    }
    
    // Convert image to blob
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('No se pudo obtener el contexto del canvas');
      throw new Error('No se pudo obtener el contexto del canvas');
    }
    
    // Resize image if needed
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    // Convert canvas to blob with explicit PNG format for better transparency support
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob && blob.size > 0) {
          resolve(blob);
        } else {
          console.error('Failed to create image blob or blob is empty');
          reject(new Error('No se pudo convertir la imagen a blob o el blob está vacío'));
        }
      }, 'image/png', 1.0); // Using PNG with maximum quality
    });
    
    console.log(`Created blob successfully. Size: ${blob.size} bytes, type: ${blob.type}`);
    
    // Prepare form data for API request
    const formData = new FormData();
    formData.append('image_file', blob, 'image.png'); // Changed to PNG
    
    // Call Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'KBXMs6odBPBjmHs7o4acFCkj'
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ errors: [{ title: response.statusText }] }));
      console.error('API error response:', errorData);
      throw new Error(`Error en la API: ${errorData.errors?.[0]?.title || response.statusText}`);
    }
    
    // Get result as blob and validate it
    const resultBlob = await response.blob();
    
    if (!resultBlob || resultBlob.size === 0) {
      console.error('Received empty result blob from API');
      throw new Error('La API devolvió un resultado vacío');
    }
    
    console.log(`Received result blob. Size: ${resultBlob.size} bytes, type: ${resultBlob.type}`);
    return resultBlob;
  } catch (error) {
    console.error('Error al remover el fondo:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (!file || file.size === 0) {
      console.error('Invalid image file: empty or null', file);
      reject(new Error('Invalid image file: empty or null'));
      return;
    }
    
    const img = new Image();
    
    // Set up onload before setting src
    img.onload = () => {
      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        console.error('Loaded image has invalid dimensions', img.naturalWidth, img.naturalHeight);
        reject(new Error('Loaded image has invalid dimensions'));
        return;
      }
      console.log(`Image loaded successfully. Size: ${img.naturalWidth}x${img.naturalHeight}`);
      resolve(img);
    };
    
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src); // Clean up
    };
    
    img.crossOrigin = 'anonymous';
    
    // Create a URL for the blob and set it as the image source
    const objectUrl = URL.createObjectURL(file);
    console.log('Created object URL for image:', objectUrl);
    img.src = objectUrl;
  });
};
