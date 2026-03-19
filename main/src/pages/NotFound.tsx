import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-slate-200">We couldn’t find the page you were looking for.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Go back home
      </Link>
    </section>
  )
}
