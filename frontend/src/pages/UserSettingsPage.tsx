import { useSettingsStore } from "../store/useSettingsStore";

export default function UserSettings() {
  const contrast = useSettingsStore( //Gets constant contrast from settings state store
    (state) => state.contrast
  );

  const setContrast = useSettingsStore( //Gets contrast function from settings state store
    (state) => state.setContrast
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-start pt-16 px-4">
      <h1 className="text-4xl font-bold mb-6">
        User Settings
      </h1>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">

        {/* Contrast Slider (lable updates live) */}
        <div className="space-y-2"> 

          <label className="font-medium text-lg">
            Contrast: {contrast}
          </label> 
          
          <input //This is the slider, ranging from 0 to 200 
            type="range"
            min={0}
            max={200}
            step={1}
            value={contrast}
            onChange={(e) =>
              setContrast(Number(e.target.value)) //Sets the contrast to a new number
            }
            className="w-full accent-blue-500" //Tailwind styling
          />

        </div>

      </div>
    </div>
  );
}