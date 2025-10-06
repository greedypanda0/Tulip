import { FaPaintBrush, FaEraser, FaPencilAlt } from "react-icons/fa";
import { useCanvas } from "@/context/canvas-context";
import { useRef } from "react";
import clsx from "clsx";

export default function Tools() {
  const {
    eraserMode,
    setEraserMode,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
  } = useCanvas();
  const colorInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    {
      name: "Pencil",
      icon: <FaPencilAlt className="text-xl" />,
      action: () => setEraserMode(false),
      active: !eraserMode,
    },
    {
      name: "Eraser",
      icon: <FaEraser className="text-xl" />,
      action: () => setEraserMode(true),
      active: eraserMode,
    },
  ];

  const baseBtn =
    "p-2 rounded-md border-2 border-black shadow-[2px_2px_0px_#000] transition-all";
  const hover = "hover:bg-gray-100";

  return (
    <div className="grid grid-cols-3 gap-3 p-3 justify-items-center">
      {/* Pencil & Eraser */}
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.action}
          title={tool.name}
          className={clsx(baseBtn, hover, {
            "bg-yellow-300": tool.active,
            "bg-white": !tool.active,
          })}
        >
          {tool.icon}
        </button>
      ))}

      {/* Stroke Width */}
      <div
        className={clsx(baseBtn, hover, "bg-white flex flex-col items-center")}
      >
        <input
          type="number"
          min={1}
          max={50}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-10 text-center bg-transparent border-b border-black text-sm focus:outline-none"
          title="Stroke Width"
        />
      </div>

      {/* Color Picker */}
      <button
        onClick={() => colorInputRef.current?.click()}
        title="Color"
        className={clsx(baseBtn, hover, "bg-white")}
      >
        <FaPaintBrush className="text-xl" style={{ color }} />
        <input
          ref={colorInputRef}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="hidden"
        />
      </button>
    </div>
  );
}
