"use client";

import { useState } from "react";

export default function LoginDialog() {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (name.trim()) {
      localStorage.setItem("userId", crypto.randomUUID());
      localStorage.setItem("name", name.trim());
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      {/* Login box */}
      <div className="relative bg-yellow-300 border-4 border-black rounded-2xl shadow-[6px_6px_0px_#000] w-full max-w-sm p-6 flex flex-col items-center text-center">
        <h1 className="text-black font-black text-3xl mb-6 drop-shadow-[2px_2px_0px_#fff]">
          Login First!
        </h1>

        <input
          type="text"
          placeholder="Your cool name 😎"
          className="w-full rounded-xl border-2 border-black p-3 mb-4 text-center font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-black/30 shadow-[3px_3px_0px_#000]"
          onChange={(e) => setName(e.target.value)}
          value={name}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          className="bg-pink-500 border-2 border-black text-white font-bold px-6 py-3 rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
          onClick={handleLogin}
        >
          Rock n Roll 🚀
        </button>

        <div className="absolute -top-3 -right-3 w-6 h-6 bg-black rounded-full border-2 border-yellow-300"></div>
      </div>
    </div>
  );
}
