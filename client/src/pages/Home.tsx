import type React from "react";
import { Background } from "../components/background";
import { Brush, Cat, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { NameCard } from "../components/namecard";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const [isNameCard, setIsNameCard] = useState(false);

  const handleRoom = () => {
    const name = localStorage.getItem("name");
    if (!name) {
      setIsNameCard(true);
      return;
    }
    if (roomIdInput.trim() === "") {
      setError("Room ID cannot be empty");
      return;
    }
    setError("");
    navigate(`/room/${roomIdInput}`);
  };

  return (
    <div className="min-h-screen bg-bg relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      <Background />

      <div className="w-full max-w-4xl flex flex-row items-center z-10 space-x-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white border-4 border-border-custom rounded-3xl p-4 shadow-primary relative">
            {/* Absolute positioning badge */}
            <span className="absolute -top-3.5 -right-3.5 rotate-12 bg-secondary text-text-main border-2 border-border-custom px-2 py-0.5 rounded-lg text-xs font-bold font-fredoka flex items-center gap-1 shadow-secondary select-none">
              <Sparkles className="w-3 h-3 animate-pulse text-amber-600" />
              YES
            </span>

            <h1 className="text-4xl md:text-5xl font-black font-fredoka tracking-tight text-accent">
              Tulip<span className="text-primary">Draw</span>
            </h1>
          </div>

          <p className="text-text-muted text-base md:text-lg max-w-md mx-auto font-outfit font-medium pt-2">
            The ultimate playful multiplayer canvas! Draw, chat, and doodle with
            your friends. 100% free, no signups required.
          </p>
        </div>

        {/*CARD */}

        <div className="relative w-full max-w-md bg-surface border-4 border-border-custom rounded-3xl shadow-[8px_8px_0px_var(--border)] p-6 md:p-8">
          <span className="absolute -top-3.5 -right-3.5 rotate-12 bg-primary border-2 border-border-custom px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-secondary select-none">
            <Cat className="w-10 h-10 animate-pulse text-amber-600" />
          </span>

          <h3 className="text-2xl font-bold font-fredoka text-center text-text-main my-2">
            Join/Create Room
          </h3>

          <p className="text-text-muted text-center text-sm md:text-base font-outfit mx-auto max-w-md">
            Have an invite code from a friend? Enter it below. Want to create
            room ? enter name! to join whiteboard.
          </p>

          <div className="w-full my-12">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-bold text-lg">
                #
              </span>

              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => {
                  setRoomIdInput(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                placeholder="funny-panda-42"
                className="w-full rounded-2xl border-4 border-border bg-accent px-12 py-3 font-semibold outline-none transition-transform focus:translate-y-1"
              />
            </div>

            {error && (
              <p className="mt-2 text-sm font-semibold text-danger">{error}</p>
            )}
          </div>

          <Button onClick={handleRoom} className="bg-primary">
            <Brush className="inline-block" /> Join Room
          </Button>
        </div>
      </div>

      {isNameCard && <NameCard onClose={() => setIsNameCard(false)} />}
    </div>
  );
};
