'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />,
});

export type Language = 'javascript' | 'python' | 'java' | 'typescript' | 'cpp' | 'go';

interface CollaborativeCodingPadProps {
  sessionId?: string;
  initialCode?: string;
  initialLanguage?: Language;
  readOnly?: boolean;
  showOutput?: boolean;
  onCodeChange?: (code: string, language: Language) => void;
  onRunCode?: (code: string, language: Language) => Promise<{ output: string; error?: string }>;
  onSaveSnapshot?: (code: string) => void;
  collaboratorCursor?: { line: number; column: number } | null;
  collaboratorName?: string;
}

const LANGUAGE_CONFIG: Record<Language, { label: string; monacoLang: string }> = {
  javascript: { label: 'JavaScript', monacoLang: 'javascript' },
  typescript: { label: 'TypeScript', monacoLang: 'typescript' },
  python: { label: 'Python', monacoLang: 'python' },
  java: { label: 'Java', monacoLang: 'java' },
  cpp: { label: 'C++', monacoLang: 'cpp' },
  go: { label: 'Go', monacoLang: 'go' },
};

const DEFAULT_CODE: Record<Language, string> = {
  javascript: '// Start coding here\n\nfunction solution() {\n  \n}\n',
  typescript: '// Start coding here\n\nfunction solution(): void {\n  \n}\n',
  python: '# Start coding here\n\ndef solution():\n    pass\n',
  java: '// Start coding here\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
  cpp: '// Start coding here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  go: '// Start coding here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    \n}\n',
};

export default function CollaborativeCodingPad({
  sessionId,
  initialCode,
  initialLanguage = 'javascript',
  readOnly = false,
  showOutput: showOutputProp = true,
  onCodeChange,
  onRunCode,
  onSaveSnapshot,
  collaboratorCursor,
  collaboratorName,
}: CollaborativeCodingPadProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[initialLanguage]);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef<unknown>(null);
  const decorationsRef = useRef<string[]>([]);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save snapshots every 30 seconds
  useEffect(() => {
    if (onSaveSnapshot && !readOnly) {
      snapshotIntervalRef.current = setInterval(() => {
        onSaveSnapshot(code);
      }, 30000);

      return () => {
        if (snapshotIntervalRef.current) {
          clearInterval(snapshotIntervalRef.current);
        }
      };
    }
  }, [code, onSaveSnapshot, readOnly]);

  // Update collaborator cursor decoration
  useEffect(() => {
    if (editorRef.current && collaboratorCursor) {
      const editor = editorRef.current as {
        deltaDecorations: (oldDecorations: string[], newDecorations: unknown[]) => string[];
      };
      const monaco = (window as { monaco?: unknown }).monaco as {
        Range: new (startLine: number, startColumn: number, endLine: number, endColumn: number) => unknown;
      } | undefined;

      if (monaco) {
        decorationsRef.current = editor.deltaDecorations(
          decorationsRef.current,
          [
            {
              range: new monaco.Range(
                collaboratorCursor.line,
                collaboratorCursor.column,
                collaboratorCursor.line,
                collaboratorCursor.column + 1
              ),
              options: {
                className: 'collaborator-cursor',
                hoverMessage: { value: collaboratorName || 'Collaborator' },
              },
            },
          ]
        );
      }
    }
  }, [collaboratorCursor, collaboratorName]);

  const handleEditorDidMount = useCallback((editor: unknown) => {
    editorRef.current = editor;

    const typedEditor = editor as {
      onDidChangeCursorPosition: (callback: (e: { position: { lineNumber: number; column: number } }) => void) => void;
      addCommand: (keybinding: number, handler: () => void) => void;
    };

    // Track cursor position
    typedEditor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Add keyboard shortcuts
    const monaco = (window as { monaco?: { KeyMod: { CtrlCmd: number }; KeyCode: { Enter: number; KeyS: number } } }).monaco;
    if (monaco) {
      // Ctrl/Cmd + Enter to run
      typedEditor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        handleRunCode
      );

      // Ctrl/Cmd + S to save snapshot
      typedEditor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          if (onSaveSnapshot) {
            onSaveSnapshot(code);
            toast.success('Snapshot saved');
          }
        }
      );
    }
  }, [code, onSaveSnapshot]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode, language);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (!code || code === DEFAULT_CODE[language]) {
      setCode(DEFAULT_CODE[newLanguage]);
    }
    onCodeChange?.(code, newLanguage);
  };

  const handleRunCode = async () => {
    if (!onRunCode) {
      toast.error('Code execution not available');
      return;
    }

    setIsRunning(true);
    setShowOutput(true);
    setOutput('Running...');

    try {
      const result = await onRunCode(code, language);

      if (result.error) {
        setOutput(`Error:\n${result.error}`);
      } else {
        setOutput(result.output || 'No output');
      }
    } catch (error) {
      setOutput(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            disabled={readOnly}
            className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none disabled:opacity-50"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          {/* Cursor Position */}
          <span className="text-xs text-gray-400">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>

          {/* Collaborator indicator */}
          {collaboratorName && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {collaboratorName} is editing
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save Snapshot */}
          {onSaveSnapshot && !readOnly && (
            <button
              onClick={() => {
                onSaveSnapshot(code);
                toast.success('Snapshot saved');
              }}
              className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              Save
            </button>
          )}

          {/* Run Code */}
          {onRunCode && showOutputProp && (
            <button
              onClick={handleRunCode}
              disabled={isRunning || readOnly}
              className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Run
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[language].monacoLang}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
          }}
        />
      </div>

      {/* Output Panel */}
      {showOutputProp && showOutput && (
        <div className="border-t border-gray-700 bg-gray-950">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <span className="text-sm font-medium text-gray-300">Output</span>
            <button
              onClick={() => setShowOutput(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <pre className="p-4 text-sm font-mono text-green-400 overflow-auto max-h-40">
            {output}
          </pre>
        </div>
      )}

      {/* Collaborator cursor style */}
      <style jsx global>{`
        .collaborator-cursor {
          background-color: rgba(59, 130, 246, 0.5);
          border-left: 2px solid #3b82f6;
        }
      `}</style>
    </div>
  );
}
