// src/pages/UserSettingsPage.tsx
import { useSettingsStore } from "../store/useSettingsStore";

export default function UserSettingsPage() {
  const contrast = useSettingsStore((s) => s.contrast);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const lineHeight = useSettingsStore((s) => s.lineHeight);

  const setContrast = useSettingsStore((s) => s.setContrast);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setLineHeight = useSettingsStore((s) => s.setLineHeight);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
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
          className="w-full accent-purple-500"
        />
      </div>
    </div>
  );
}