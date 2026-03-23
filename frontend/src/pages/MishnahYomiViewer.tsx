// MishnahYomiViewer.tsx
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export default function MishnahYomiViewer() {
  const [hebrewText, setHebrewText] = useState<string>('');
  const [hebrewSegments, setHebrewSegments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { fontSize, lineHeight, dyslexiaFont, contrast } = useSettingsStore();

  useEffect(() => {
    const fetchHebrewText = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hebrew-text');
        if (!response.ok) {
          throw new Error('Failed to fetch Hebrew text');
        }
        const data = await response.json();
        setHebrewText(data.hebrew_text);
        setHebrewSegments(data.hebrew_segments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHebrewText();
  }, []);

  const textStyle = {
    fontSize: `${fontSize}%`,
    lineHeight: lineHeight,
    fontFamily: dyslexiaFont ? 'OpenDyslexic, sans-serif' : 'inherit',
  };

  const containerStyle = {
    backgroundColor: `hsl(0, 0%, ${100 - (contrast - 100) * 0.2}%)`,
    color: `hsl(0, 0%, ${(contrast - 100) * 0.2}%)`,
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start pt-16 px-4" style={containerStyle}>
      <h1 className="text-4xl font-bold mb-6" style={textStyle}>Mishnah Yomi Viewer</h1>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md" style={containerStyle}>
        {loading && <p style={textStyle}>Loading...</p>}
        {error && <p className="text-red-500" style={textStyle}>Error: {error}</p>}
        {hebrewText && (
          <div>
            <h2 className="text-2xl font-semibold mb-4" style={textStyle}>Daily Mishnah (Hebrew)</h2>
            {hebrewSegments.length > 0 ? (
              <div className="text-right space-y-4" dir="rtl" style={textStyle}>
                {hebrewSegments.map((segment, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {segment}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-right text-lg leading-relaxed" dir="rtl" style={textStyle}>{hebrewText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}