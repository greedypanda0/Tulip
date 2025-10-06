"use client";
import { Message } from "@/feature/room/chats";
import { createContext, useContext, useState } from "react";

interface CanvasState {
  color: string;
  strokeWidth: number;
  eraserMode: boolean;
  setColor: (c: string) => void;
  setStrokeWidth: (w: number) => void;
  setEraserMode: (e: boolean) => void;
  chats: Message[];
  setChats: (c: Message[]) => void;
}

const CanvasContext = createContext<CanvasState | null>(null);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState("#ff1493");
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [eraserMode, setEraserMode] = useState(false);
  const [chats, setChats] = useState<Message[]>([]);

  return (
    <CanvasContext.Provider
      value={{
        color,
        setColor,
        strokeWidth,
        setStrokeWidth,
        eraserMode,
        setEraserMode,
        chats,
        setChats,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used within a CanvasProvider");
  return ctx;
};
