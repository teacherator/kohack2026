// src/components/AudioPlayerBar.tsx
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useLocation } from "react-router-dom";

export default function AudioPlayerBar() {
  const { pathname } = useLocation();
  const { isPlaying, play, pause, currentTime, duration, setTime, src } = useAudioStore();
  const showAudioGlobally = useSettingsStore((s) => s.showAudioBar);

  // Show audio player if:
  // 1) user enabled globally OR
  // 2) current route is Mishnah Yomi
  if (!src && !(pathname === "/mishnah-yomi" || showAudioGlobally)) return null;

  const togglePlayback = () => {
    if (isPlaying) pause();
    else play();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-blue-200 px-6 py-4 shadow-inner z-50">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Button size="icon" variant="outline" onClick={togglePlayback}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={1}
          onValueChange={(value) => setTime(value[0])}
          className="flex-1"
        />

        <span className="text-sm text-blue-800 w-16 text-right">
          {Math.floor(currentTime)}s
        </span>
      </div>
    </div>
  );
}