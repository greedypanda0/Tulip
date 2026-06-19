import type React from "react";
import { Background } from "../components/background";
import { Sidebar } from "../components/sidebar";
import Canvas from "../components/canvas";
import { useState } from "react";
import { Board } from "../canvas/board";
import { BoardContext } from "../context/board";
import { SocketProvider } from "../context/socket";
import { useParams } from "react-router-dom";
import { NameCard } from "../components/namecard";
import { Topbar } from "../components/topbar";

export const Room: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const { roomId } = useParams();
  const [name, setName] = useState<string | null>(localStorage.getItem("name"));

  return (
    <div className="h-screen bg-bg relative flex flex-col overflow-hidden select-none">
      <Topbar />
      {!name && <NameCard onClose={(name) => setName(name)} />}
      
      <Background />
      <SocketProvider name={name ?? "Anonn"} room={roomId!}>
        <BoardContext.Provider value={board}>
          <div className="flex-1 flex min-h-0 z-10">
            {/* Canvas */}
            <div className="flex-1 min-h-0 p-12">
              <div className="h-full w-full overflow-hidden rounded-3xl">
                <Canvas onReady={setBoard} />
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </BoardContext.Provider>
      </SocketProvider>
    </div>
  );
};
