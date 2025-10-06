"use client";
import useUserData from "@/hooks/use-data";
import { useSocket } from "@/hooks/use-socket";
import Sidebar from "./sidebar";
import Canvas from "./canvas";
import { CanvasProvider } from "@/context/canvas-context";

export default function RoomPage({ room }: { room: string }) {
  const { name, userId } = useUserData();
  const { socket, roomMembers } = useSocket({
    name,
    userId,
    room,
  });

  return (
    <div className="w-full h-full flex flex-row">
      <CanvasProvider>
        <Sidebar roomMembers={roomMembers} socket={socket} />
        <Canvas socket={socket} />
      </CanvasProvider>
    </div>
  );
}
