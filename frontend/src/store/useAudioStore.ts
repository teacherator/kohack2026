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
    const audio = new Audio(src);

    audio.ontimeupdate = () =>
      set({ currentTime: audio.currentTime });

    audio.onloadedmetadata = () =>
      set({ duration: audio.duration });

    set({ audio, src, isPlaying: false });
  },

  play: () => {
    const audio = get().audio;
    if (!audio) return;

    audio.play();
    set({ isPlaying: true });
  },

  pause: () => {
    const audio = get().audio;
    if (!audio) return;

    audio.pause();
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