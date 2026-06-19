import type { Stroke } from "./types";

export class Board {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDrawing: boolean;
  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;
  private backgroundColor: string = "#fef3c6";
  color: string = "black";
  brushSize: number = 1;
  tool: number = 0;
  send: (data: Stroke) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.send = () => {};
    this.ctx = canvas.getContext("2d")!;
    this.isDrawing = false;

    this.init();
  }

  private init() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.canvas.style.backgroundColor = this.backgroundColor;

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.onResize);
  }

  setColor = (color: string) => {
    this.color = color;
  };

  setBrushSize = (size: number) => {
    this.brushSize = size;
  };

  setTool = (tool: number) => {
    this.tool = tool;
  };

  addStroke = (stroke: Stroke) => {
    const isOldStroke = this.strokes.find((s) => s.id === stroke.id);
    if (isOldStroke) {
      isOldStroke.points = stroke.points;
    } else {
      this.strokes.push(stroke);
    }

    this.draw();
  };

  private onResize = () => {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.draw();
  };

  private handleMouseDown = (event: MouseEvent) => {
    this.isDrawing = true;
    const pos = this.getMousePos(event);

    this.currentStroke = {
      id: Date.now().toString(),
      points: [
        {
          x: pos.x,
          y: pos.y,
        },
      ],
      color: this.tool === 0 ? this.color : this.backgroundColor,
      width: this.brushSize,
    };

    this.send(this.currentStroke);
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.isDrawing || !this.currentStroke) return;

    const pos = this.getMousePos(event);

    this.currentStroke.points.push({
      x: pos.x,
      y: pos.y,
    });

    this.draw();
    this.send(this.currentStroke);
  };

  private handleMouseUp = () => {
    if (this.currentStroke) {
      this.strokes.push(this.currentStroke);
    }

    this.currentStroke = null;
    this.isDrawing = false;
  };

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const strokes = this.currentStroke
      ? [...this.strokes, this.currentStroke]
      : this.strokes;

    for (const stroke of strokes) {
      this.drawStroke(stroke);
    }
  }

  private drawStroke(stroke: Stroke) {
    const points = stroke.points;

    if (points.length < 2) {
      this.ctx.beginPath();
      this.ctx.fillStyle = stroke.color;

      this.ctx.arc(points[0].x, points[0].y, stroke.width / 2, 0, Math.PI * 2);

      this.ctx.fill();
      return;
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = stroke.color;
    this.ctx.lineWidth = stroke.width;

    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
  }

  getMousePos(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  addSend = (callback: (data: Stroke) => void) => {
    this.send = callback;
  };

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }
}
