
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ImagePreviewPanelProps {
  imageUrl: string;
  previewUrl: string | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ImagePreviewPanel = ({ 
  imageUrl, 
  previewUrl, 
  activeTab,
  setActiveTab 
}: ImagePreviewPanelProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="original" className="text-xs sm:text-sm">Original</TabsTrigger>
        <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="original" className="mt-2">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Original image" 
            className="max-w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[350px] mx-auto object-contain" 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="preview" className="mt-2">
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Edited preview" 
              className="max-w-full h-auto max-h-[180px] sm:max-h-[250px] md:max-h-[350px] mx-auto object-contain" 
            />
          ) : (
            <div className="flex items-center justify-center h-[120px] sm:h-[180px] md:h-[220px] bg-gray-50 text-gray-400 text-xs sm:text-sm">
              No preview generated yet
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
