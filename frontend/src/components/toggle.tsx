// src/components/Toggle.tsx
//import React from "react";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onColor?: string;      // optional: color when ON
  offColor?: string;     // optional: color when OFF
}

export default function Toggle({
  label,
  checked,
  onChange,
  onColor = "bg-yellow-600",
  offColor = "bg-gray-300",
}: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-800">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        {/* Track */}
        <div
          className={`w-12 h-6 rounded-full transition-colors ${
            checked ? onColor : offColor
          }`}
        />
        {/* Knob */}
        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform peer-checked:translate-x-6 flex items-center justify-center text-xs font-semibold text-gray-800">
          {checked ? "On" : "Off"}
        </div>
      </label>
    </div>
  );
}