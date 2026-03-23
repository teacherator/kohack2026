// src/components/AudioPlayerBar.tsx
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

// Utility: convert seconds to mm:ss
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayerBar() {
  const { pathname } = useLocation();
  const { isPlaying, play, pause, currentTime, duration, setTime, src } =
    useAudioStore();
  const setAudio = useAudioStore((s) => s.setAudio);
  const setSrc = useAudioStore((s) => s.setSrc);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Register DOM audio element and ensure store is wired to it
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setAudio(el);

    // If src was already set before the audio element mounted, re-apply it
    if (src) {
      try {
        setSrc(src);
      } catch (err) {
        console.error("Failed to set audio src", err);
      }
    }

    // Cleanup: pause audio on unmount
    return () => {
      try {
        el.pause();
      } catch (err) {
        console.error("Failed to pause audio on unmount", err);
      }
    };
  }, [setAudio, setSrc, src]);

  const showAudioGlobally = useSettingsStore((s) => s.showAudioBar);

  // Show the player if Mishnah Yomi page OR user enabled globally
  if (!src && !(pathname === "/mishnah-yomi" || showAudioGlobally)) return null;

  const togglePlayback = () => {
    try {
      if (isPlaying) pause();
      else play();
    } catch (err) {
      console.error("Playback toggle failed", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-blue-200 px-6 py-4 shadow-inner z-50">
      {/* Hidden DOM audio element so browsers consider play() user-initiated */}
      <audio
        ref={audioRef}
        id="global-audio"
        preload="metadata"
        style={{ display: "none" }}
      />
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* Play/Pause button */}
        <Button size="icon" variant="outline" onClick={togglePlayback}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        {/* Slider */}
        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={1}
          onValueChange={(value) => setTime(value[0])}
          className="flex-1"
        />

        {/* Time display */}
        <span className="text-sm text-blue-800 w-24 text-right font-mono">
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </span>
      </div>
    </div>
  );
}