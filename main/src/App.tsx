import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-lg font-semibold tracking-tight">Vite React TS Starter</h1>
          <nav className="flex gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'text-indigo-400 font-medium'
                  : 'text-slate-200 hover:text-white'
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'text-indigo-400 font-medium'
                  : 'text-slate-200 hover:text-white'
              }
            >
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl p-4 text-xs text-slate-500">
          Built with Vite, React, TypeScript, Tailwind, Zustand & Vitest.
        </div>
      </footer>
    </div>
  )
}
