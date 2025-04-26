
import { toast } from "@/hooks/use-toast";

export const upscaleImage = async (imageBlob: Blob, scale: number): Promise<Blob | null> => {
  try {
    console.log(`Upscaling image to ${scale}x with API...`);
    
    // Convert image to base64
    const base64 = await blobToBase64(imageBlob);
    
    // Create form data for API request
    const formData = new FormData();
    formData.append('image', base64);
    formData.append('scale', scale.toString());
    
    // Call DeepAI Super Resolution API
    const response = await fetch('https://api.deepai.org/api/torch-srgan', {
      method: 'POST',
      headers: {
        'Api-Key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K' // Demo key, should be replaced with real key
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.output_url) {
      throw new Error('The API did not return an image URL');
    }
    
    // Download the upscaled image
    const upscaledResponse = await fetch(data.output_url);
    if (!upscaledResponse.ok) {
      throw new Error(`Failed to download upscaled image: ${upscaledResponse.statusText}`);
    }
    
    const upscaledBlob = await upscaledResponse.blob();
    return upscaledBlob;
  } catch (error) {
    console.error('Error upscaling image:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Could not upscale the image. Please try again.",
    });
    return null;
  }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
