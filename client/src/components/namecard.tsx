import { useState } from "react";
import { User } from "lucide-react";

export const NameCard = ({ onClose }: { onClose: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;

    localStorage.setItem("name", name);
    onClose(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border-4 border-border-custom bg-secondary p-6 shadow-[8px_8px_0px_var(--border-border-custom)]">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black font-fredoka">
            🌷 Welcome to Tulip
          </h2>
          <p className="mt-2 text-black">
            Pick a name before joining the garden
          </p>
        </div>

        <div className="relative mb-4">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={18}
          />

          <input
            autoFocus
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Lucky"
            className="w-full rounded-2xl border-4 border-border-custom bg-primary-hover py-3 pl-12 pr-4 font-bold font-fredoka outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_var(--border-border-custom)] shadow-[4px_4px_0px_var(--border-border-custom)]"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-2xl border-4 border-border-custom bg-accent py-3 font-bold font-fredoka shadow-[4px_4px_0px_var(--border-border-custom)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--border-border-custom)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          Join Garden 🌷
        </button>
      </div>
    </div>
  );
};
