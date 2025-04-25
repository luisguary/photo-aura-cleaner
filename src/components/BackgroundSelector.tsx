
import React from 'react';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface BackgroundSelectorProps {
  onSelectBackground: (color: string) => void;
  selectedBackground: string;
}

const BackgroundSelector = ({ onSelectBackground, selectedBackground }: BackgroundSelectorProps) => {
  const backgrounds = [
    { id: 'transparent', label: 'Transparente', value: 'transparent' },
    { id: 'white', label: 'Blanco', value: '#FFFFFF' },
    { id: 'black', label: 'Negro', value: '#000000' },
    { id: 'red', label: 'Rojo', value: '#ea384c' },
    { id: 'blue', label: 'Azul', value: '#1EAEDB' },
    { id: 'green', label: 'Verde', value: '#34c759' },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Seleccionar fondo</Label>
      <RadioGroup
        value={selectedBackground}
        onValueChange={onSelectBackground}
        className="grid grid-cols-3 gap-4"
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
    </div>
  );
};

export default BackgroundSelector;
