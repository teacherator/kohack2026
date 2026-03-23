// src/pages/UserSettingsPage.tsx
import { useSettingsStore } from "../store/useSettingsStore";
import Slider from "../components/slider";
import Toggle from "../components/toggle";

export default function UserSettingsPage() {
  const { contrast, fontSize, lineHeight, dyslexiaFont, reducedMotion } =
    useSettingsStore();
  const { setContrast, setFontSize, setLineHeight, setDyslexiaFont, setReducedMotion } =
    useSettingsStore();

  return (
    <div className="space-y-8 max-w-lg mx-auto p-6">
      {/* Sliders */}
      <div className="space-y-6">
        <Slider
          label="Contrast"
          value={contrast}
          min={50}
          max={200}
          onChange={setContrast}
          accentColor="accent-yellow-400"
        />
        <Slider
          label="Font Size"
          value={fontSize}
          min={75}
          max={150}
          onChange={setFontSize}
          accentColor="accent-pink-400"
        />
        <Slider
          label="Line Height"
          value={lineHeight}
          min={1}
          max={2}
          step={0.05}
          onChange={setLineHeight}
          accentColor="accent-cyan-400"
        />
      </div>

      {/* Toggles */}
      <div className="border-t pt-6 space-y-4">
        <Toggle
          label="Dyslexia-friendly font"
          checked={dyslexiaFont}
          onChange={setDyslexiaFont}
          onColor="bg-yellow-600"
          offColor="bg-yellow-400"
        />
        <Toggle
          label="Reduced motion"
          checked={reducedMotion}
          onChange={setReducedMotion}
          onColor="bg-pink-600"
          offColor="bg-pink-400"
        />
      </div>
    </div>
  );
}