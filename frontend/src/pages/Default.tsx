import { useCounterStore } from '../store/useCounterStore'

export default function Home() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Home</h2>
      <p className="text-slate-200">
        This starter app includes routing (React Router), state management (Zustand), styling (Tailwind CSS), and testing (Vitest + React Testing Library).
      </p>

      <div className="rounded-xl bg-slate-900/60 p-6 shadow-sm">
        <p className="text-sm text-slate-300">Zustand counter state (shared across routes):</p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-5xl font-bold">{count}</p>
            <p className="text-xs text-slate-400">Click buttons to update state</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={increment}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              +
            </button>
            <button
              onClick={decrement}
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              -
            </button>
            <button
              onClick={reset}
              className="rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
