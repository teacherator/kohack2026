import { create } from "zustand";

interface AudioState {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  src: string | null;

  setAudio: (audio: HTMLAudioElement) => void;
  setSrc: (src: string) => void;
  play: () => void;
  pause: () => void;
  setTime: (time: number) => void;
  setDuration: (duration: number) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  src: null,

  setAudio: (audio) => set({ audio }),

  setSrc: (src) => {
    const existingAudio = get().audio;

    if (existingAudio) {
      try {
        existingAudio.pause();
      } catch (e) {
        console.error("Failed to pause existing audio", e);
      }

      existingAudio.src = src;
      existingAudio.load();

      existingAudio.ontimeupdate = () =>
        set({ currentTime: existingAudio.currentTime });
      existingAudio.onloadedmetadata = () =>
        set({ duration: existingAudio.duration });
      existingAudio.onended = () => set({ isPlaying: false });

      set({ src, isPlaying: false, currentTime: 0 });
      return;
    }

    // No DOM audio element registered yet - create a fallback Audio object
    const audio = new Audio(src);

    audio.ontimeupdate = () => set({ currentTime: audio.currentTime });
    audio.onerror = (e) => {
      console.error("Audio failed to load", audio.src, e);
    };
    audio.onloadedmetadata = () => set({ duration: audio.duration });
    audio.onended = () => set({ isPlaying: false });

    set({ audio, src, isPlaying: false, currentTime: 0 });
  },

  play: () => {
    const audio = get().audio;
    if (!audio) return;

    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => set({ isPlaying: true })).catch((err) => {
        console.error("Audio play failed", err);
        set({ isPlaying: false });
      });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const audio = get().audio;
    if (!audio) return;

    try {
      audio.pause();
    } catch (err) {
      console.error("Audio pause failed", err);
    }
    set({ isPlaying: false });
  },

  setTime: (time) => {
    const audio = get().audio;
    if (!audio) return;

    audio.currentTime = time;
    set({ currentTime: time });
  },

  setDuration: (duration) => set({ duration }),
}));