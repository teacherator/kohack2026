import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/store/useAudioStore";

type VoiceCommand =
  | { action: "stop_listening"; message: string }
  | { action: "navigate"; path: string; message: string }
  | { action: "go_back"; message: string }
  | { action: "scroll"; amount: number; message: string }
  | { action: "play_audio"; message: string }
  | { action: "pause_audio"; message: string }
  | { action: "unknown"; message: string };

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function normalizeTranscript(transcript: string) {
  return transcript.toLowerCase().trim();
}

function parseVoiceCommand(transcript: string): VoiceCommand {
  const text = normalizeTranscript(transcript);

  if (text.includes("stop listening") || text === "stop" || text.includes("exit") || text.includes("quit")) {
    return { action: "stop_listening", message: "Voice commands stopped." };
  }

  if (text.includes("go back") || text === "back") {
    return { action: "go_back", message: "Going back." };
  }

  if (text.includes("scroll down")) {
    return { action: "scroll", amount: 500, message: "Scrolling down." };
  }

  if (text.includes("scroll up")) {
    return { action: "scroll", amount: -500, message: "Scrolling up." };
  }

  if (text.includes("settings")) {
    return { action: "navigate", path: "/settings", message: "Opening settings." };
  }

  if (text.includes("about")) {
    return { action: "navigate", path: "/about", message: "Opening about page." };
  }

  if (text.includes("login")) {
    return { action: "navigate", path: "/login", message: "Opening login page." };
  }

  if (text.includes("mishnah")) {
    return { action: "navigate", path: "/mishnah-yomi", message: "Opening Mishnah Yomi." };
  }

  if (text.includes("home")) {
    return { action: "navigate", path: "/", message: "Going home." };
  }

  if (text.includes("pause audio") || text.includes("pause")) {
    return { action: "pause_audio", message: "Pausing audio." };
  }

  if (
    text.includes("play audio") ||
    text.includes("resume audio") ||
    text.includes("play") ||
    text.includes("resume")
  ) {
    return { action: "play_audio", message: "Playing audio." };
  }

  return { action: "unknown", message: `Heard "${transcript}", but no matching command was found.` };
}

export default function VoiceCommandControl() {
  const navigate = useNavigate();
  const play = useAudioStore((state) => state.play);
  const pause = useAudioStore((state) => state.pause);

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const isStartingRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage("Voice commands are not supported in this browser.");
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result.isFinal) {
          continue;
        }

        const spokenText = result[0]?.transcript?.trim();
        if (!spokenText) {
          continue;
        }

        setTranscript(spokenText);
        const command = parseVoiceCommand(spokenText);

        if (command.action === "stop_listening") {
          shouldKeepListeningRef.current = false;
          setStatusMessage(command.message);
          setIsListening(false);
          recognition.stop();
          return;
        }

        if (command.action === "navigate") {
          navigate(command.path);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setStatusMessage(command.message);
          continue;
        }

        if (command.action === "go_back") {
          navigate(-1);
          setStatusMessage(command.message);
          continue;
        }

        if (command.action === "scroll") {
          window.scrollBy({ top: command.amount, behavior: "smooth" });
          setStatusMessage(command.message);
          continue;
        }

        if (command.action === "play_audio") {
          play();
          setStatusMessage(command.message);
          continue;
        }

        if (command.action === "pause_audio") {
          pause();
          setStatusMessage(command.message);
          continue;
        }

        setStatusMessage(command.message);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted" && !shouldKeepListeningRef.current) {
        return;
      }

      if (event.error === "not-allowed") {
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        setStatusMessage("Microphone access was blocked. Please allow microphone access and try again.");
        return;
      }

      setStatusMessage(`Voice recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      isStartingRef.current = false;

      if (!shouldKeepListeningRef.current) {
        setIsListening(false);
        return;
      }

      try {
        recognition.start();
        setIsListening(true);
        setStatusMessage((currentMessage) =>
          currentMessage || "Listening for commands. Say stop to end voice control."
        );
      } catch (error) {
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        setStatusMessage(
          error instanceof Error ? error.message : "Could not restart voice recognition."
        );
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepListeningRef.current = false;
      recognition.stop();
    };
  }, [navigate, pause, play]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (isListening) {
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      setStatusMessage("Voice commands stopped.");
      recognition.stop();
      return;
    }

    if (isStartingRef.current) {
      return;
    }

    try {
      isStartingRef.current = true;
      shouldKeepListeningRef.current = true;
      setTranscript("");
      setStatusMessage("Listening for commands. Say stop to end voice control.");
      recognition.start();
      setIsListening(true);
    } catch (error) {
      isStartingRef.current = false;
      shouldKeepListeningRef.current = false;
      setIsListening(false);
      setStatusMessage(
        error instanceof Error ? error.message : "Could not start voice recognition."
      );
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant={isListening ? "secondary" : "default"}
        className={isListening ? "" : "bg-blue-600 text-white hover:bg-blue-700"}
        onClick={toggleListening}
        disabled={!isSupported}
      >
        {isListening ? "Stop Voice Control" : "Start Voice Control"}
      </Button>
      <div className="max-w-xs text-right text-sm text-gray-600">
        {statusMessage && <p aria-live="polite">{statusMessage}</p>}
        {transcript && <p>Heard: {transcript}</p>}
      </div>
    </div>
  );
}
