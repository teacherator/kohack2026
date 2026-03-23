// src/pages/UserSettingsPage.tsx
import { useSettingsStore } from "../store/useSettingsStore";

export default function UserSettingsPage() {
  const contrast = useSettingsStore((s) => s.contrast);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const lineHeight = useSettingsStore((s) => s.lineHeight);
  const dyslexiaFont = useSettingsStore((s) => s.dyslexiaFont);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);

  const setContrast = useSettingsStore((s) => s.setContrast);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setLineHeight = useSettingsStore((s) => s.setLineHeight);
  const setDyslexiaFont = useSettingsStore((s) => s.setDyslexiaFont);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      {/* Tier 1 Sliders */}
      <div className="space-y-6">
        {/* Contrast */}
        <div>
          <label className="block font-medium mb-1">
            Contrast: {contrast}%
          </label>
          <input
            type="range"
            min={50}
            max={200}
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block font-medium mb-1">
            Font Size: {fontSize}%
          </label>
          <input
            type="range"
            min={75}
            max={150}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>

        {/* Line Height */}
        <div>
          <label className="block font-medium mb-1">
            Line Height: {lineHeight.toFixed(2)}
          </label>
          <input
            type="range"
            min={1}
            max={2}
            step={0.05}
            value={lineHeight}
            onChange={(e) => setLineHeight(Number(e.target.value))}
            className="w-full accent-red-500"
          />
        </div>
      </div>

      {/* Tier 2 Toggles */}
        <div className="border-t pt-6 space-y-4">
          {/* Dyslexia Font Toggle */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Dyslexia-friendly font</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dyslexiaFont}
                onChange={(e) => setDyslexiaFont(e.target.checked)}
                className="sr-only peer"
              />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>

      {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Reduced motion</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform peer-checked:translate-x-5"></div>
          </label>
        </div>
      </div>
  
    </div>
  );
}