"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  room?: string | null;
  name?: string | null;
  userId?: string | null;
}

interface User {
  userId: string; // stable ID from client
  socketId: string; // current connection
  name: string;
  room: string;
}

export function useSocket({ room, name, userId }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [roomMembers, setRoomMembers] = useState<User[]>([]);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      const socket = io(process.env.SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        // Join room if available
        if (room) {
          socket.emit("join_room", {
            userId: userId,
            name: name || "Anonymous",
            room,
          });
        }
      });

      // Other events
      socket.on("user_joined", (users: User[]) => setRoomMembers(users));
      socket.on("user_left", (users: User[]) => setRoomMembers(users));

      return () => {
        socket.off("user_joined");
        socket.off("user_left");
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [room, name, userId]);

  return { socket: socketRef.current, roomMembers };
}
