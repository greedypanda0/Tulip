"use client";
import useUserData from "@/hooks/use-data";
import LoginDialog from "@/app/components/login-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const { name, userId } = useUserData();
  const [room, setRoom] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (room.trim()) {
      router.push(
        `/room/${encodeURIComponent(room.trim().replaceAll(" ", "-"))}`
      );
    }
  };

  return (
    <div className="relative flex h-full w-full justify-center items-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* subtle floating shapes for cartoon effect */}
      <div className="absolute top-10 left-20 w-20 h-20 bg-yellow-300 rounded-full rotate-12 opacity-70 animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full -rotate-6 opacity-60 animate-bounce"></div>

      {/* Join Box */}
      <div className="relative bg-yellow-300 border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] w-full max-w-sm p-6 flex flex-col items-center text-center transform rotate-[1deg] hover:rotate-[-1deg] transition-transform duration-200">
        <h1 className="text-black font-black text-3xl mb-6 drop-shadow-[3px_3px_0px_#fff] animate-[wiggle_1s_ease-in-out_infinite]">
          Hello, {name}!
        </h1>

        <input
          type="text"
          placeholder="Your cool room name 😎"
          className="w-full rounded-xl border-2 border-black p-3 mb-4 text-center font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/30 shadow-[4px_4px_0px_#000]"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        />

        <button
          className="bg-pink-500 border-2 border-black text-white font-bold px-6 py-3 rounded-xl shadow-[4px_4px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all hover:scale-105 animate-bounce-slow"
          onClick={handleJoin}
        >
          Rock n Roll 🚀
        </button>

        <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full border-2 border-yellow-300 animate-spin-slow"></div>
      </div>

      {/* Login Box */}
      {!userId && <LoginDialog />}
    </div>
  );
}
