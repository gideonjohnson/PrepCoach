'use client';

import { useState, useRef, useEffect, useCallback, MouseEvent, TouchEvent } from 'react';

type Tool = 'pen' | 'eraser' | 'rectangle' | 'ellipse' | 'arrow' | 'text' | 'select';
type Color = string;

type DrawElement = {
  id: string;
  type: 'path' | 'rectangle' | 'ellipse' | 'arrow' | 'text';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
};

type WhiteboardProps = {
  width?: number;
  height?: number;
  onSave?: (imageData: string) => void;
  readonly?: boolean;
};

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const STROKE_WIDTHS = [2, 4, 6, 8, 12];

export default function Whiteboard({
  width = 1200,
  height = 800,
  onSave,
  readonly = false,
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<Color>('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(null);
  const [history, setHistory] = useState<DrawElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Redraw canvas when elements change
  useEffect(() => {
    redrawCanvas();
  }, [elements]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Draw current element if drawing
    if (currentElement) {
      drawElement(ctx, currentElement);
    }
  }, [elements, currentElement]);

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawElement) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (element.type) {
      case 'path':
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'rectangle':
        if (element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
          ctx.strokeRect(element.x, element.y, element.width, element.height);
        }
        break;

      case 'ellipse':
        if (element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
          ctx.beginPath();
          ctx.ellipse(
            element.x + element.width / 2,
            element.y + element.height / 2,
            Math.abs(element.width / 2),
            Math.abs(element.height / 2),
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }
        break;

      case 'arrow':
        if (element.points && element.points.length >= 2) {
          const start = element.points[0];
          const end = element.points[element.points.length - 1];

          // Draw line
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const headLength = 15;

          ctx.beginPath();
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
        break;

      case 'text':
        if (element.x !== undefined && element.y !== undefined && element.text) {
          ctx.font = `${element.strokeWidth * 4}px sans-serif`;
          ctx.fillText(element.text, element.x, element.y);
        }
        break;
    }
  };

  const getCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (readonly) return;

    const coords = getCoordinates(e);
    setIsDrawing(true);

    const newElement: DrawElement = {
      id: Date.now().toString(),
      type: tool === 'pen' || tool === 'eraser' ? 'path' :
            tool === 'rectangle' ? 'rectangle' :
            tool === 'ellipse' ? 'ellipse' :
            tool === 'arrow' ? 'arrow' : 'path',
      points: [coords],
      x: coords.x,
      y: coords.y,
      width: 0,
      height: 0,
      color: tool === 'eraser' ? '#1f2937' : color,
      strokeWidth: tool === 'eraser' ? strokeWidth * 3 : strokeWidth,
    };

    setCurrentElement(newElement);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement || readonly) return;

    const coords = getCoordinates(e);

    if (currentElement.type === 'path' || currentElement.type === 'arrow') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), coords],
      });
    } else if (currentElement.type === 'rectangle' || currentElement.type === 'ellipse') {
      setCurrentElement({
        ...currentElement,
        width: coords.x - (currentElement.x || 0),
        height: coords.y - (currentElement.y || 0),
      });
    }

    redrawCanvas();
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentElement) return;

    setIsDrawing(false);

    // Only add if there's actual content
    const hasContent = currentElement.type === 'path' || currentElement.type === 'arrow'
      ? (currentElement.points?.length || 0) > 1
      : Math.abs(currentElement.width || 0) > 5 || Math.abs(currentElement.height || 0) > 5;

    if (hasContent) {
      const newElements = [...elements, currentElement];
      setElements(newElements);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setCurrentElement(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  const handleClear = () => {
    setElements([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    onSave?.(imageData);
  };

  const handleAddText = () => {
    const text = prompt('Enter text:');
    if (!text) return;

    const newElement: DrawElement = {
      id: Date.now().toString(),
      type: 'text',
      x: width / 2,
      y: height / 2,
      text,
      color,
      strokeWidth,
    };

    const newElements = [...elements, newElement];
    setElements(newElements);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Toolbar */}
      {!readonly && (
        <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700 flex-wrap">
          {/* Tools */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded ${tool === 'pen' ? 'bg-orange-500' : 'hover:bg-gray-600'}`}
              title="Pen"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded ${tool === 'eraser' ? 'bg-orange-500' : 'hover:bg-gray-600'}`}
              title="Eraser"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setTool('rectangle')}
              className={`p-2 rounded ${tool === 'rectangle' ? 'bg-orange-500' : 'hover:bg-gray-600'}`}
              title="Rectangle"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={() => setTool('ellipse')}
              className={`p-2 rounded ${tool === 'ellipse' ? 'bg-orange-500' : 'hover:bg-gray-600'}`}
              title="Ellipse"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth={2} />
              </svg>
            </button>
            <button
              onClick={() => setTool('arrow')}
              className={`p-2 rounded ${tool === 'arrow' ? 'bg-orange-500' : 'hover:bg-gray-600'}`}
              title="Arrow"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={handleAddText}
              className="p-2 rounded hover:bg-gray-600"
              title="Add Text"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600" />

          {/* Colors */}
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-orange-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600" />

          {/* Stroke Width */}
          <div className="flex items-center gap-1">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  strokeWidth === w ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={`${w}px`}
              >
                <div
                  className="bg-white rounded-full"
                  style={{ width: w + 2, height: w + 2 }}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-600" />

          {/* Actions */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded hover:bg-gray-600 disabled:opacity-50"
            title="Undo"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded hover:bg-gray-600 disabled:opacity-50"
            title="Redo"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded hover:bg-gray-600"
            title="Clear All"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {onSave && (
            <>
              <div className="w-px h-8 bg-gray-600" />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium text-sm"
              >
                Save
              </button>
            </>
          )}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-800 p-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="bg-gray-700 rounded-lg cursor-crosshair mx-auto block"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
