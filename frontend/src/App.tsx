// src/App.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useSettingsStore } from "./store/useSettingsStore";

export default function App() {
  // Login state from the auth zustand store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Basic accessibility settings
  const contrast = useSettingsStore((s) => s.contrast);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const lineHeight = useSettingsStore((s) => s.lineHeight);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const dyslexiaFont = useSettingsStore((s) => s.dyslexiaFont);

  return (
    <div
      className={`min-h-screen bg-white text-gray-900 ${dyslexiaFont ? "font-dyslexia" : ""}`}
      style={{
        filter: `contrast(${contrast}%)`,
        fontSize: `${fontSize}%`,
        lineHeight: lineHeight,
        transition: reducedMotion ? "none" : "all 0.3s ease",
      }}
    >
      {/* Navbar */}
      <nav className="border-b p-4 flex items-center justify-between">
        {/* Left - links */}
        <div className="flex gap-8 items-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-bold"
                : "text-blue-600 hover:underline font-medium"
            }
          >
            Home
          </NavLink>

          {/* Dropdown - Learning Schedules */}
          <div className="relative group inline-block">
            <button
              type="button"
              className="flex items-center gap-1 text-blue-600 hover:underline font-medium focus:outline-none"
            >
              Learning Schedules
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-10">
              <NavLink
                to="/mishnah-yomi"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2.5 text-blue-700 font-medium bg-blue-50"
                    : "block px-4 py-2.5 text-blue-600 hover:bg-gray-50 hover:text-blue-700"
                }
              >
                Mishnah Yomi
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-bold"
                : "text-blue-600 hover:underline font-medium"
            }
          >
            User Settings
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-700 font-bold"
                : "text-blue-600 hover:underline font-medium"
            }
          >
            About
          </NavLink>
        </div>

        {/* Right - auth status */}
        <div className="flex items-center gap-2 text-sm font-medium">
          {isLoggedIn ? (
            <span className="text-green-600">Logged In</span>
          ) : (
            <span className="text-gray-500">Guest</span>
          )}
        </div>
      </nav>

      {/* Page content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}