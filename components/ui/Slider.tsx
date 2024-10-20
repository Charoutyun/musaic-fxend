// components/ui/slider.tsx

import React from "react";

interface SliderProps {
  value: number[];
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ value, max, step, onValueChange, className }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value)]);
  };

  return (
    <input
      type="range"
      value={value[0]}
      max={max}
      step={step}
      onChange={handleChange}
      className={className}
    />
  );
};

export default Slider;
