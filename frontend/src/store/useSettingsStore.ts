// src/store/useSettingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  contrast: number;     // 0–200%
  fontSize: number;     // Percentage out of 100
  lineHeight: number;   // Between 1-2
  setContrast: (value: number) => void;
  setFontSize: (value: number) => void;
  setLineHeight: (value: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      contrast: 100,
      fontSize: 100,
      lineHeight: 1.5,

      setContrast: (value) => set({ contrast: value }),
      setFontSize: (value) => set({ fontSize: value }),
      setLineHeight: (value) => set({ lineHeight: value }),
    }),
    { name: "user-settings" }
  )
);