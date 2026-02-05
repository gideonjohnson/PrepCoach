'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />,
});

export type Language = 'javascript' | 'python' | 'java' | 'typescript' | 'cpp' | 'go';

interface CodingInterviewProps {
  question: string;
  starterCode?: Record<Language, string>;
  expectedOutput?: string;
  testCases?: Array<{ input: string; expected: string }>;
  onSubmit: (code: string, language: Language) => Promise<void>;
  onRunCode?: (code: string, language: Language) => Promise<{ output: string; error?: string }>;
}

const LANGUAGE_CONFIG: Record<Language, { label: string; extension: string; icon: string }> = {
  javascript: { label: 'JavaScript', extension: 'js', icon: '🟨' },
  typescript: { label: 'TypeScript', extension: 'ts', icon: '🔷' },
  python: { label: 'Python', extension: 'py', icon: '🐍' },
  java: { label: 'Java', extension: 'java', icon: '☕' },
  cpp: { label: 'C++', extension: 'cpp', icon: '⚙️' },
  go: { label: 'Go', extension: 'go', icon: '🔵' },
};

const DEFAULT_STARTER_CODE: Record<Language, string> = {
  javascript: `function solution() {
  // Write your code here

  return result;
}

// Test your solution
console.log(solution());`,
  typescript: `function solution(): any {
  // Write your code here

  return result;
}

// Test your solution
console.log(solution());`,
  python: `def solution():
    # Write your code here

    return result

# Test your solution
print(solution())`,
  java: `public class Solution {
    public static Object solution() {
        // Write your code here

        return result;
    }

    public static void main(String[] args) {
        System.out.println(solution());
    }
}`,
  cpp: `#include <iostream>
using namespace std;

auto solution() {
    // Write your code here

    return result;
}

int main() {
    cout << solution() << endl;
    return 0;
}`,
  go: `package main

import "fmt"

func solution() interface{} {
    // Write your code here

    return result
}

func main() {
    fmt.Println(solution())
}`,
};

export default function CodingInterview({
  question,
  starterCode,
  expectedOutput,
  testCases,
  onSubmit,
  onRunCode,
}: CodingInterviewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState<string>(
    starterCode?.[selectedLanguage] || DEFAULT_STARTER_CODE[selectedLanguage]
  );
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef<any>(null);

  // Update code when language changes
  useEffect(() => {
    const newCode = starterCode?.[selectedLanguage] || DEFAULT_STARTER_CODE[selectedLanguage];
    setCode(newCode);
    setOutput('');
    setShowOutput(false);
  }, [selectedLanguage, starterCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Add keybindings
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => handleRunCode()
    );
  };

  const handleRunCode = async () => {
    if (!onRunCode) {
      toast.error('Code execution not available for this question');
      return;
    }

    setIsRunning(true);
    setShowOutput(true);
    setOutput('Running...');

    try {
      const result = await onRunCode(code, selectedLanguage);

      if (result.error) {
        setOutput(`❌ Error:\n${result.error}`);
        toast.error('Code execution failed');
      } else {
        setOutput(`✅ Output:\n${result.output}`);
        toast.success('Code executed successfully!');
      }
    } catch (error: any) {
      setOutput(`❌ Execution Error:\n${error.message || 'Unknown error'}`);
      toast.error('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(code, selectedLanguage);
      toast.success('Solution submitted! Getting AI feedback...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const defaultCode = starterCode?.[selectedLanguage] || DEFAULT_STARTER_CODE[selectedLanguage];
    setCode(defaultCode);
    setOutput('');
    setShowOutput(false);
    toast.success('Code reset to starter template');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Question Section */}
      <div className="bg-white rounded-t-2xl p-6 border-b-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Coding Challenge</h3>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="whitespace-pre-wrap leading-relaxed">{question}</p>
        </div>

        {expectedOutput && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm font-semibold text-blue-900 mb-1">Expected Output:</p>
            <code className="text-sm text-blue-700 font-mono">{expectedOutput}</code>
          </div>
        )}

        {testCases && testCases.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
            <p className="text-sm font-semibold text-purple-900 mb-2">Test Cases:</p>
            {testCases.map((testCase, index) => (
              <div key={index} className="text-sm text-purple-700 font-mono mb-1">
                <span className="font-semibold">Input:</span> {testCase.input} →{' '}
                <span className="font-semibold">Expected:</span> {testCase.expected}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm font-medium border-2 border-gray-600 hover:border-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => (
              <option key={lang} value={lang}>
                {config.icon} {config.label}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-400 ml-2">
            Press Ctrl/Cmd + Enter to run
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
          >
            🔄 Reset
          </button>

          {onRunCode && (
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>▶️ Run Code</>
              )}
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>🚀 Submit & Get Feedback</>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-[400px] bg-gray-900">
        <Editor
          height="100%"
          language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            suggest: {
              showWords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
          }}
        />
      </div>

      {/* Output Section */}
      {showOutput && (
        <div className="bg-gray-900 border-t-2 border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-300">Output</h4>
            <button
              onClick={() => setShowOutput(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <pre className="bg-black rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto max-h-48 overflow-y-auto">
            {output || 'No output yet. Run your code to see results.'}
          </pre>
        </div>
      )}
    </div>
  );
}
