import { Brush, Eraser, Palette, Redo2, Undo2 } from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { useBoard } from "../context/board";
const PRESET_COLORS = [
  "#2d3436", // Black
  "#ffffff", // White
  "#ff7675", // Red
  "#e17055", // Orange
  "#fdcb6e", // Yellow
  "#2ecc71", // Green
  "#0984e3", // Blue
  "#6c5ce7", // Purple
  "#fd79a8", // Pink
  "#a1785c", // Brown
];

export const SidebarTools: React.FC = () => {
  const board = useBoard();
  const [tool, setTool] = useState("brush");
  const [brushSize, setBrushSize] = useState(1);
  const [color, setColor] = useState("black");

  useEffect(() => {
    if (!board) return;

    setTool(board.tool === 0 ? "brush" : "eraser");
    setBrushSize(board.brushSize);
    setColor(board.color);
  }, [board]);

  const onToolChange = (tool: string) => {
    setTool(tool);
    board.setTool(tool === "brush" ? 0 : 1);
  };
  const onUndo = () => {};
  const onRedo = () => {};
  const onColorChange = (color: string) => {
    setColor(color);
    board.setColor(color);
  };
  const onBrushSizeChange = (size: number) => {
    setBrushSize(size);
    board.setBrushSize(size);
  };

  return (
    <div className="flex-1 bg-primary flex flex-col gap-12">
      {/*Tools */}
      <div className="w-full space-y-4 mt-2">
        <h4 className="font-fredoka text-sm font-bold text-text-main uppercase tracking-wide">
          Select Tool
        </h4>
        <div className="flex flex-row gap-4 px-2">
          <Button
            icon={<Brush />}
            className={
              "bg-accent " +
              (tool === "brush" ? "bg-accent-hover text-white" : "")
            }
            onClick={() => onToolChange("brush")}
          />
          <Button
            icon={<Eraser />}
            className={
              "bg-accent " +
              (tool === "eraser" ? "bg-accent-hover text-white" : "")
            }
            onClick={() => onToolChange("eraser")}
          />
        </div>
      </div>

      {/* Brush Size Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-fredoka text-sm font-bold text-text-main uppercase tracking-wide">
            Brush Size
          </h4>
          <span className="font-mono font-bold text-sm bg-white border border-border-custom px-2 py-0.5 rounded-lg mr-2">
            {brushSize}px
          </span>
        </div>
        <div className="flex items-center gap-3 bg-secondary border-2 border-border-custom rounded-2xl p-3 mx-2">
          {/* Visual brush preview circle */}
          <div className="w-10 h-10 flex items-center justify-center bg-accent border-2 border-border-custom rounded-xl shrink-0">
            <div
              style={{
                width: `${Math.max(2, Math.min(brushSize, 32))}px`,
                height: `${Math.max(2, Math.min(brushSize, 32))}px`,
                backgroundColor: tool === "eraser" ? "#cbd5e1" : color,
              }}
              className="rounded-full transition-all duration-75"
            />
          </div>

          <input
            type="range"
            min="2"
            max="40"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
            className="flex-1 accent-primary h-2 bg-surface rounded-lg appearance-none cursor-pointer border border-border-custom"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-fredoka text-sm font-bold text-text-main uppercase tracking-wide">
          Colors
        </h4>
        <div className="grid grid-cols-5 gap-2 p-3 bg-accent border-2 border-border-custom rounded-2xl mx-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              style={{ backgroundColor: c }}
              className={`w-9 h-9 rounded-xl border-2 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center ${
                color === c
                  ? "border-primary ring-2 ring-primary/20 scale-110"
                  : "border-border-custom"
              }`}
              title={c}
            >
              {c === "#ffffff" && color === c && (
                <div className="w-2.5 h-2.5 bg-border rounded-full" />
              )}
            </button>
          ))}

          {/* Custom Color Picker input */}
          <div className="relative w-9 h-9 flex items-center justify-center bg-surface border-2 border-border-custom rounded-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer">
            <Palette className="w-5 h-5 text-text-muted pointer-events-none" />
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Custom Color"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-auto border-t-2 border-dashed border-border-custom pt-4 mb-2">
        <h4 className="font-fredoka text-sm font-bold text-text-main uppercase tracking-wide">
          Actions
        </h4>
        <div className="grid grid-cols-2 gap-2 mx-2">
          <Button onClick={onUndo} title="Undo stroke" className="bg-secondary">
            <Undo2 className="w-5 h-5" />
          </Button>
          <Button onClick={onRedo} title="Redo stroke" className="bg-secondary">
            <Redo2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
