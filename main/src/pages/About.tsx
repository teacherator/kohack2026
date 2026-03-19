export default function About() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">About</h2>
      <p className="text-slate-200">
        This project is a starter template for building modern React applications with TypeScript.
      </p>
      <ul className="list-disc pl-5 text-slate-200">
        <li>Routing with <strong>React Router</strong></li>
        <li>State management with <strong>Zustand</strong></li>
        <li>Styles with <strong>Tailwind CSS</strong></li>
        <li>Tests with <strong>Vitest</strong> + <strong>React Testing Library</strong></li>
      </ul>
    </section>
  )
}
