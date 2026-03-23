// src/App.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSettingsStore } from "./store/useSettingsStore";
import { useEffect } from "react";
import AudioPlayerBar from "./components/AudioPlayerBar";
import { Button } from "@/components/ui/button";
import VoiceCommandControl from "./components/VoiceCommandControl";

export default function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const contrast = useSettingsStore((s) => s.contrast);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const lineHeight = useSettingsStore((s) => s.lineHeight);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const dyslexiaFont = useSettingsStore((s) => s.dyslexiaFont);

  // Apply dyslexia font toggle globally
  useEffect(() => {
    document.documentElement.classList.toggle(
      "font-dyslexia",
      dyslexiaFont
    );
  }, [dyslexiaFont]);

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-gray-900"
      style={{
        filter: `contrast(${contrast}%)`,
        fontSize: `${fontSize}%`,
        lineHeight: lineHeight,
        transition: reducedMotion ? "none" : "all 0.3s ease",
      }}
    >
      {/* Navbar */}
      <nav className="border-b p-4 flex items-center justify-between bg-white shadow-sm">
        {/* Left side links */}
        <div className="flex gap-6 items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-semibold"
                : "text-blue-600 hover:text-blue-700 hover:underline font-medium"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/mishnah-yomi"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-semibold"
                : "text-blue-600 hover:text-blue-700 hover:underline font-medium"
            }
          >
            Mishnah Yomi
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-semibold"
                : "text-blue-600 hover:text-blue-700 hover:underline font-medium"
            }
          >
            User Settings
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-semibold"
                : "text-blue-600 hover:text-blue-700 hover:underline font-medium"
            }
          >
            About Us
          </NavLink>
        </div>

        {/* Right side: Guest Mode / Login */}
        <div className="flex items-center gap-3">
          <VoiceCommandControl />
          {isLoggedIn ? (
            <>
              <span className="text-green-600 font-semibold">Logged In</span>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  // TODO: logout handler
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <span className="text-gray-600 font-semibold">Guest Mode</span>
              <NavLink to="/login">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Login
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6 pb-32">
        <Outlet />
      </main>

      {/* Persistent Audio Player */}
      <AudioPlayerBar />
    </div>
  );
}
