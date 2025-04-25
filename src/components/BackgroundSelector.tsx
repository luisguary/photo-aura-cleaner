
import React, { useRef } from 'react';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

interface BackgroundSelectorProps {
  onSelectBackground: (color: string) => void;
  onSelectCustomBackground: (imageUrl: string) => void;
  selectedBackground: string;
}

const BackgroundSelector = ({ 
  onSelectBackground, 
  onSelectCustomBackground, 
  selectedBackground 
}: BackgroundSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgrounds = [
    { id: 'transparent', label: 'Transparente', value: 'transparent' },
    { id: 'white', label: 'Blanco', value: '#FFFFFF' },
    { id: 'black', label: 'Negro', value: '#000000' },
    { id: 'red', label: 'Rojo', value: '#ea384c' },
    { id: 'blue', label: 'Azul', value: '#1EAEDB' },
    { id: 'green', label: 'Verde', value: '#34c759' },
  ];

  const handleCustomBackgroundSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSelectCustomBackground(imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Seleccionar fondo</Label>
      <RadioGroup
        value={selectedBackground}
        onValueChange={onSelectBackground}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {backgrounds.map(({ id, label, value }) => (
          <div
            key={id}
            className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent"
          >
            <RadioGroupItem value={value} id={id} className="peer" />
            <Label
              htmlFor={id}
              className="grow cursor-pointer text-sm font-normal"
            >
              {label}
            </Label>
            <div
              className="h-6 w-6 rounded border"
              style={{
                backgroundColor: value,
                backgroundImage: value === 'transparent' ? 
                  'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)' : 
                  'none',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
              }}
            />
          </div>
        ))}
      </RadioGroup>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir fondo personalizado
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCustomBackgroundSelect}
        />
      </div>
    </div>
  );
};

export default BackgroundSelector;

