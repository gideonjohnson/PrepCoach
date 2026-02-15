'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { systemDesignTemplates, DiagramTemplate } from '@/lib/system-design-templates';

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => {
    const mod = await import('@excalidraw/excalidraw');
    return mod.Excalidraw;
  },
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Loading canvas...</div> }
);

interface SystemDesignCanvasProps {
  sessionId?: string;
  initialData?: Record<string, unknown>;
  readOnly?: boolean;
  onDataChange?: (data: Record<string, unknown>) => void;
  onSaveSnapshot?: (data: Record<string, unknown>) => void;
  onRequestAnalysis?: (data: Record<string, unknown>) => Promise<{
    score?: number;
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
  }>;
  problemTitle?: string;
  requirements?: string[];
}

export default function SystemDesignCanvas({
  sessionId,
  initialData,
  readOnly = false,
  onDataChange,
  onSaveSnapshot,
  onRequestAnalysis,
  problemTitle,
  requirements = [],
}: SystemDesignCanvasProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score?: number;
    strengths?: string[];
    weaknesses?: string[];
    suggestions?: string[];
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [checkedRequirements, setCheckedRequirements] = useState<Set<number>>(new Set());
  const [showTemplates, setShowTemplates] = useState(false);
  const excalidrawRef = useRef<{
    getSceneElements: () => unknown[];
    getAppState: () => Record<string, unknown>;
    updateScene: (scene: { elements: unknown[] }) => void;
  } | null>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const templateDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-save snapshots every 60 seconds
  useEffect(() => {
    if (onSaveSnapshot && !readOnly && excalidrawRef.current) {
      snapshotIntervalRef.current = setInterval(() => {
        const elements = excalidrawRef.current?.getSceneElements();
        const appState = excalidrawRef.current?.getAppState();
        if (elements && appState) {
          onSaveSnapshot({ elements, appState });
        }
      }, 60000);

      return () => {
        if (snapshotIntervalRef.current) {
          clearInterval(snapshotIntervalRef.current);
        }
      };
    }
  }, [onSaveSnapshot, readOnly]);

  const handleChange = useCallback((elements: readonly unknown[], appState: Record<string, unknown>) => {
    if (onDataChange) {
      onDataChange({ elements: [...elements], appState });
    }
  }, [onDataChange]);

  const handleSave = () => {
    if (excalidrawRef.current && onSaveSnapshot) {
      const elements = excalidrawRef.current.getSceneElements();
      const appState = excalidrawRef.current.getAppState();
      onSaveSnapshot({ elements, appState });
      toast.success('Design saved');
    }
  };

  const handleAnalysis = async () => {
    if (!onRequestAnalysis || !excalidrawRef.current) return;

    setIsAnalyzing(true);
    try {
      const elements = excalidrawRef.current.getSceneElements();
      const appState = excalidrawRef.current.getAppState();
      const result = await onRequestAnalysis({ elements, appState });
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (error) {
      toast.error('Failed to analyze design');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRequirement = (index: number) => {
    setCheckedRequirements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const loadTemplate = (template: DiagramTemplate) => {
    if (!excalidrawRef.current) return;

    // Get current elements to merge with template
    const currentElements = excalidrawRef.current.getSceneElements();

    // Calculate offset to avoid overlapping with existing elements
    let offsetX = 0;
    if (currentElements && currentElements.length > 0) {
      const maxX = Math.max(
        ...(currentElements as Array<{ x: number; width?: number }>).map(
          (el) => el.x + (el.width || 0)
        )
      );
      offsetX = maxX + 100;
    }

    // Apply offset to template elements
    const offsetElements = (template.elements as Array<{ x: number; [key: string]: unknown }>).map(
      (el) => ({
        ...el,
        x: el.x + offsetX,
      })
    );

    // Merge with existing elements
    const mergedElements = [...(currentElements as unknown[]), ...offsetElements];

    excalidrawRef.current.updateScene({ elements: mergedElements });
    setShowTemplates(false);
    toast.success(`Loaded "${template.name}" template`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
    };

    if (showTemplates) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTemplates]);

  // Group templates by category
  const templatesByCategory = systemDesignTemplates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, DiagramTemplate[]>);

  return (
    <div className="flex h-full bg-white rounded-xl overflow-hidden border-2 border-gray-200">
      {/* Sidebar - Requirements */}
      {requirements.length > 0 && (
        <div className="w-72 border-r-2 border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Requirements</h3>
            {problemTitle && (
              <p className="text-sm text-gray-500 mt-1">{problemTitle}</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {requirements.map((req, index) => (
                <label
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    checkedRequirements.has(index)
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedRequirements.has(index)}
                    onChange={() => toggleRequirement(index)}
                    className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className={`text-sm ${checkedRequirements.has(index) ? 'text-green-700' : 'text-gray-700'}`}>
                    {req}
                  </span>
                </label>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {checkedRequirements.size}/{requirements.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(checkedRequirements.size / requirements.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">System Design Canvas</span>

            {/* Template Selector */}
            {!readOnly && (
              <div className="relative" ref={templateDropdownRef}>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Templates
                  <svg className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showTemplates && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500">
                        Click a template to add it to your canvas. Templates will be placed next to existing elements.
                      </p>
                    </div>

                    {Object.entries(templatesByCategory).map(([category, templates]) => (
                      <div key={category} className="py-2">
                        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {category}
                        </div>
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => loadTemplate(template)}
                            className="w-full px-3 py-2 text-left hover:bg-orange-50 transition-colors flex flex-col"
                          >
                            <span className="font-medium text-gray-900 text-sm">{template.name}</span>
                            <span className="text-xs text-gray-500">{template.description}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onSaveSnapshot && !readOnly && (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Save
              </button>
            )}

            {onRequestAnalysis && (
              <button
                onClick={handleAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Get AI Feedback
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          {/* @ts-expect-error - Excalidraw types mismatch with ref */}
          <Excalidraw
            ref={excalidrawRef}
            initialData={initialData ? {
              elements: initialData.elements as unknown[],
              appState: initialData.appState as Record<string, unknown>,
            } : undefined}
            onChange={handleChange}
            viewModeEnabled={readOnly}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                export: false,
                saveAsImage: true,
              },
            }}
          />
        </div>
      </div>

      {/* Analysis Sidebar */}
      {showAnalysis && analysis && (
        <div className="w-80 border-l-2 border-gray-200 flex flex-col bg-gray-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">AI Analysis</h3>
            <button
              onClick={() => setShowAnalysis(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Score */}
            {analysis.score !== undefined && (
              <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl font-bold text-orange-500">{analysis.score}</div>
                <div className="text-sm text-gray-500">out of 100</div>
              </div>
            )}

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
