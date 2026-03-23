// MishnahYomiViewer.tsx
import { useState, useEffect } from 'react';

export default function MishnahYomiViewer() {
  const [hebrewText, setHebrewText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHebrewText = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hebrew-text');
        if (!response.ok) {
          throw new Error('Failed to fetch Hebrew text');
        }
        const data = await response.json();
        setHebrewText(data.hebrew_text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHebrewText();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start pt-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Mishnah Yomi Viewer</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {hebrewText && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Daily Mishnah (Hebrew)</h2>
            <p className="text-right text-lg leading-relaxed" dir="rtl">{hebrewText}</p>
          </div>
        )}
      </div>
    </div>
  );
}