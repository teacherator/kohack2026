// src/store/useSettingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  contrast: number;
  fontSize: number;
  lineHeight: number;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  showAudioBar: boolean;

  setContrast: (value: number) => void;
  setFontSize: (value: number) => void;
  setLineHeight: (value: number) => void;
  setReducedMotion: (value: boolean) => void;
  setDyslexiaFont: (value: boolean) => void;
  setShowAudioBar: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      contrast: 100,
      fontSize: 100,
      lineHeight: 1.5,
      reducedMotion: false,
      dyslexiaFont: false,
      showAudioBar: true, // default
    
      setDyslexiaFont: (value) => set({ dyslexiaFont: value }),
      setContrast: (value) => set({ contrast: value }),
      setFontSize: (value) => set({ fontSize: value }),
      setLineHeight: (value) => set({ lineHeight: value }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setShowAudioBar: (val: boolean) => set({ showAudioBar: val }),
    }),
    { name: "user-settings" }
  )
);