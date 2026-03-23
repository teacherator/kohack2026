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
    const oldAudio = get().audio; //Loading new audio and stopping old audio
    if (oldAudio) oldAudio.pause();

    const audio = new Audio(src);

    audio.ontimeupdate = () =>
      set({ currentTime: audio.currentTime });

    audio.onerror = (e) => {
      // log loading errors for debugging
      // eslint-disable-next-line no-console
      console.error('Audio failed to load', audio.src, e);
    };

    audio.onloadedmetadata = () =>
      set({ duration: audio.duration });

    audio.onended = () =>
      set({ isPlaying: false });

    set({ audio, src, isPlaying: false, currentTime: 0 });
  },

  play: () => {
    const audio = get().audio;
    if (!audio) return;

    // Play returns a promise which can reject (autoplay/CORS/404). handle it.
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => set({ isPlaying: true })).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Audio play failed', err);
        set({ isPlaying: false });
      });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => { //Pausing the audio
    const audio = get().audio;
    if (!audio) return;

    audio.pause();
    set({ isPlaying: false });
  },

  setTime: (time) => { //Current time variable
    const audio = get().audio;
    if (!audio) return;

    audio.currentTime = time;
    set({ currentTime: time });
  },

  setDuration: (duration) => set({ duration }),
}));