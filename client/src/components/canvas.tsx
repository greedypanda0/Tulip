import { useEffect, useRef, useState } from "react";
import { Board } from "../canvas/board";
import { useSocket } from "../context/socket";
import type { Stroke } from "../canvas/types";

export default function Canvas({
  onReady,
}: {
  onReady: (board: Board) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!canvasRef.current) return;

    const board = new Board(canvasRef.current);
    setBoard(board);
    onReady(board);

    return () => {
      board.destroy();
    };
  }, [onReady]);

  useEffect(() => {
    if (!socket) return;
    if (!board) return;

    const onMesssage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "stroke") {
        board.addStroke(data.data);
      }
    };

    socket.addEventListener("message", onMesssage);
    board.addSend((data: Stroke) => {
      socket.send(
        JSON.stringify({
          type: "stroke",
          data,
        }),
      );
    });

    return () => {
      socket.removeEventListener("message", onMesssage);
    };
  }, [socket, board]);

  return <canvas className="h-full w-full" ref={canvasRef} />;
}
