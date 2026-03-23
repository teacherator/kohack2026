// src/pages/MishnahYomiViewer.tsx
import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAudioStore } from '../store/useAudioStore';

export default function MishnahYomiViewer() {
  const [hebrewText, setHebrewText] = useState<string>('');
  const [hebrewSegments, setHebrewSegments] = useState<string[]>([]);
  const [englishText, setEnglishText] = useState<string>('');
  const [englishSegments, setEnglishSegments] = useState<string[]>([]);
  const [ref, setRef] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { fontSize, lineHeight, dyslexiaFont, contrast } = useSettingsStore();
  const setAudioSrc = useAudioStore((s) => s.setSrc);

  // Load Hebrew text
  useEffect(() => {
    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:5000'
      : 'https://lionfish-app-5f4rk.ondigitalocean.app';

    const fetchHebrewText = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/hebrew-text`);
        if (!response.ok) throw new Error('Failed to fetch Hebrew text');
        const data = await response.json();
        setHebrewText(data.hebrew_text);
        setHebrewSegments(data.hebrew_segments || []);
        setEnglishText(data.english_text || '');
        setEnglishSegments(data.english_segments || []);
        setRef(data.ref || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHebrewText();
  }, []);

  // Load audio AFTER component mounts and AudioPlayerBar is mounted
  useEffect(() => {
    // Try backend audio endpoint first (dev server), fall back to public path
    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:5000'
      : 'https://lionfish-app-5f4rk.ondigitalocean.app/';

    (async () => {
      try {
        const tryPaths = [`${API_BASE}/audio/mishnah.mp3`, `${API_BASE}/audio/mishnah_en.mp3`, '/audio/mishnah.mp3'];
        for (const p of tryPaths) {
          try {
            const resp = await fetch(p, { method: 'HEAD' });
            if (resp.ok) {
              setAudioSrc(p);
              return;
            }
          } catch (e) {
            // ignore and try next
          }
        }
        // fallback to original suggestion if none found
        setAudioSrc('/audio/mishnah.mp3');
      } catch (err) {
        setAudioSrc('/audio/mishnah.mp3');
      }
    })();
  }, []);

  const parseVerses = (ref: string): string[] => {
    if (!ref) return [];
    const parts = ref.split(' ');
    const last = parts[parts.length - 1];
    const colonIndex = last.indexOf(':');
    if (colonIndex === -1) return [];
    const chapter = last.substring(0, colonIndex);
    const versesPart = last.substring(colonIndex + 1);
    const dashIndex = versesPart.indexOf('-');
    if (dashIndex === -1) return [last];
    const start = parseInt(versesPart.substring(0, dashIndex));
    const end = parseInt(versesPart.substring(dashIndex + 1));
    const verses: string[] = [];
    for (let i = start; i <= end; i++) {
      verses.push(`${chapter}:${i}`);
    }
    return verses;
  };

  const textStyle = {
    fontSize: `${fontSize}%`,
    lineHeight: lineHeight,
    fontFamily: 'inherit',
  };

  // Hebrew-specific style when dyslexia font is enabled
  const hebrewStyle = {
    fontSize: `${fontSize}%`,
    lineHeight: lineHeight,
    fontFamily: dyslexiaFont ? 'OpenDyslexicHebrew, OpenDyslexic, Arial, sans-serif' : 'Arial, David, sans-serif',
  };

  const containerStyle = {
    backgroundColor: `hsl(0, 0%, ${100 - (contrast - 100) * 0.2}%)`,
    color: `hsl(0, 0%, ${(contrast - 100) * 0.2}%)`,
  };

  return (
    <div
      className="flex flex-col flex-1 w-full items-center justify-start pt-6 px-4"
      style={containerStyle}
    >
      <h1 className="text-4xl font-bold mb-6" style={textStyle}>
        Mishnah Yomi Viewer
      </h1>
      <div className="w-full max-w-2xl p-6 rounded-lg shadow-md" style={containerStyle}>
        {loading && <p style={textStyle}>Loading...</p>}
        {error && <p className="text-red-500" style={textStyle}>Error: {error}</p>}
        {hebrewText && (
          <div className="space-y-8">
            {/* Hebrew Section */}
            <div lang="he" className="hebrew">
              <h2 className="text-2xl font-semibold mb-4" style={hebrewStyle}>
                Daily Mishnah (Hebrew)
              </h2>
              {hebrewSegments.length > 0 ? (
                <div className="text-right space-y-4" dir="rtl">
                  {hebrewSegments.map((segment, index) => {
                    const verses = parseVerses(ref);
                    const tractate = ref.replace(/ \d+:\d+-\d+$/, '');
                    const label = verses[index] ? `${tractate} ${verses[index]}` : `Segment ${index + 1}`;
                    return (
                      <div key={index} className="space-y-2">
                        <h3 className="text-xl font-semibold" style={hebrewStyle}>{label}</h3>
                        <p className="text-lg leading-relaxed" style={hebrewStyle}>
                          {segment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-right text-lg leading-relaxed" dir="rtl" style={hebrewStyle}>
                  {hebrewText}
                </p>
              )}
            </div>

            {/* English Translation Section */}
            {englishText && (
              <div lang="en" className="english border-t pt-6">
                <h2 className="text-2xl font-semibold mb-4" style={textStyle}>
                  English Translation
                </h2>
                {englishSegments.length > 0 ? (
                  <div className="text-left space-y-4" dir="ltr">
                    {englishSegments.map((segment, index) => {
                      const verses = parseVerses(ref);
                      const tractate = ref.replace(/ \d+:\d+-\d+$/, '');
                      const label = verses[index] ? `${tractate} ${verses[index]}` : `Segment ${index + 1}`;
                      return (
                        <div key={index} className="space-y-2">
                          <h3 className="text-xl font-semibold" style={textStyle}>{label}</h3>
                          <p className="text-lg leading-relaxed" style={textStyle}>
                            {segment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-left text-lg leading-relaxed" dir="ltr" style={textStyle}>
                    {englishText}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
