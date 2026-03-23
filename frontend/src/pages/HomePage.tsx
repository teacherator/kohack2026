// HomePage.tsx
import { useState } from "react";

export default function HomePage() {
  const [missionText, setMissionText] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start pt-16 px-4">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">JudaicPop</h1>
      <h2 className="text-2xl font-semibold mb-6 text-blue-500">Our Mission</h2>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <textarea
          className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
          placeholder="This website provides accessibility features to Judaic texts, connecting us all to our Jewish heritage, no matter our ability. Our misssion is to provide this connection to every corner of Judaism, and together we acknowledge that the first place to connect us all is through the study of Torah."
          value={missionText}
          onChange={(e) => setMissionText(e.target.value)}
        />
      </div>
    </div>
  );
}