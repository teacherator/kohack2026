// src/components/Slider.tsx
import React from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accentColor?: string;
}

export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  accentColor = "accent-yellow-400",
}: SliderProps) {
  return (
    <div>
      <label className="block font-medium mb-1 text-gray-800">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${accentColor} hover:${accentColor.replace(
          "-400",
          "-500"
        )}`}
      />
    </div>
  );
}