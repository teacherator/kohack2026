// src/components/Layout.tsx
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="font-body min-h-screen bg-background text-gray-900">
      {/* Optional: Header */}
      <header className="p-4 bg-primary text-white">My Website</header>

      <main className="p-4">{children}</main>

      {/* Optional: Footer */}
      <footer className="p-4 text-center text-muted text-sm">
        © 2026 My Website
      </footer>
    </div>
  );
}