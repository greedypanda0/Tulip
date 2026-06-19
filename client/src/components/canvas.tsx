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
  const [cursors, setCursors] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const { socket } = useSocket();
  const name = localStorage.getItem("name");

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

    const onOpen = () => {
      socket.send(
        JSON.stringify({
          type: "get_strokes",
        }),
      );

      canvasRef.current?.addEventListener("mousemove", (event: MouseEvent) => {
        const pos = board.getMousePos(event);
        socket.send(
          JSON.stringify({
            type: "cursor",
            data: pos,
          }),
        );
      });

      canvasRef.current?.addEventListener("mouseleave", () => {
        socket.send(
          JSON.stringify({
            type: "cursor",
            data: {
              x: 0,
              y: 0,
            },
          }),
        );
      });
    };

    const onMesssage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "stroke") {
        board.addStroke(data.data);
      }
      if (data.type === "strokes") {
        for (const stroke of data.data) {
          board.addStroke(stroke);
        }
      }
      if (data.type === "cursor") {
        const point = data.data.point;
        if (data.data.user.name === name) return;

        if (point.x === 0 && point.y === 0) {
          setCursors((prev) => {
            const next = { ...prev };
            delete next[data.data.user.name];
            return next;
          });
          return;
        }

        setCursors((prev) => ({
          ...prev,
          [data.data.user.name]: data.data.point,
        }));
      }
    };

    socket.addEventListener("message", onMesssage);
    socket.addEventListener("open", onOpen);
    board.addSend((data: Stroke) => {
      if (!data) return;

      socket.send(
        JSON.stringify({
          type: "stroke",
          data,
        }),
      );
    });

    return () => {
      socket.removeEventListener("message", onMesssage);
      socket.removeEventListener("open", onOpen);
    };
  }, [socket, board]);

  return (
    <div className="relative h-full w-full">
      <canvas className="h-full w-full" ref={canvasRef} />

      {Object.entries(cursors).map(([name, pos]) => (
        <div
          key={name}
          className="absolute pointer-events-none"
          style={{
            left: pos.x,
            top: pos.y,
          }}
        >
          <span className="text-xl">🖱️</span>

          <span className="ml-1 rounded bg-black px-2 py-1 text-xs text-white">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
