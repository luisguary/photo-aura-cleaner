
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    // Convertir la imagen a base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    // Llamar a la Edge Function de Supabase
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      throw new Error('Error al procesar la imagen');
    }

    // Obtener el blob de la respuesta
    const imageBlob = await response.blob();
    return imageBlob;

  } catch (error) {
    console.error('Error al remover el fondo:', error);
    throw error;
  }
};

