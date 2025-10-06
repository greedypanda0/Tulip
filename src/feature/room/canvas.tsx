"use client";
import { useCanvas } from "@/context/canvas-context";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { Socket } from "socket.io-client";

interface Point {
  x: number;
  y: number;
}

interface Segment {
  points: Point[];
  color?: string;
  strokeWidth?: number;
  eraser?: boolean;
}

interface CanvasProps {
  socket: Socket | null;
}

export default function Canvas({ socket }: CanvasProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<Segment[]>([]);
  const isDrawing = useRef(false);
  const buffer = useRef<Point[]>([]);
  const { eraserMode, color, strokeWidth } = useCanvas();

  // Handle resizing
  useEffect(() => {
    const updateSize = () => {
      const element = document.getElementById("canvass");
      if (!element) return;
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Listen for remote draw events
  useEffect(() => {
    if (!socket) return;

    const handleDraw = (segments: Segment[]) => {
      setLines((prev) => [...prev, ...segments]);
    };

    socket.on("draw", handleDraw);
    return () => {
      socket.off("draw", handleDraw);
    };
  }, [socket]);

  // Drawing logic
  const startLine = (pos: Point) => {
    buffer.current = [pos];
    setLines((prev) => [
      ...prev,
      { points: [pos], color, strokeWidth, eraser: eraserMode },
    ]);
  };

  const addPointToLine = (pos: Point) => {
    buffer.current.push(pos);
    setLines((prev) => {
      const newLines = [...prev];
      const last = newLines[newLines.length - 1];
      if (!last) return newLines;
      last.points = [...last.points, pos];
      return newLines;
    });
  };

  const endLine = () => {
    if (!socket || buffer.current.length === 0) return;
    const segment: Segment = {
      points: buffer.current,
      color,
      strokeWidth,
      eraser: eraserMode,
    };
    socket.emit("draw", [segment]);
    buffer.current = [];
  };

  // Mouse events
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    startLine(pos);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    addPointToLine(pos);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    endLine();
  };

  return (
    <div
      id="canvass"
      className="w-full h-full border-2 border-black rounded-2xl overflow-hidden bg-white"
    >
      <Stage
        width={size.width}
        height={size.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points.flatMap((p) => [p.x, p.y])}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.eraser ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
