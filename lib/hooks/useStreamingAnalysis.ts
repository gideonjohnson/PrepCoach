import { useState, useCallback, useRef } from 'react';

type AnalysisType = 'quick' | 'scalability' | 'reliability' | 'full';

interface UseStreamingAnalysisOptions {
  sessionId: string;
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: string) => void;
}

interface StreamingAnalysisState {
  isStreaming: boolean;
  text: string;
  error: string | null;
}

export function useStreamingAnalysis({
  sessionId,
  onChunk,
  onComplete,
  onError,
}: UseStreamingAnalysisOptions) {
  const [state, setState] = useState<StreamingAnalysisState>({
    isStreaming: false,
    text: '',
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startAnalysis = useCallback(
    async (diagramData: Record<string, unknown>, analysisType: AnalysisType = 'full') => {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState({ isStreaming: true, text: '', error: null });

      try {
        const response = await fetch(`/api/system-design/${sessionId}/analyze-stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ diagramData, analysisType }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to start analysis');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const data = JSON.parse(line);

              if (data.type === 'chunk') {
                accumulatedText += data.text;
                setState((prev) => ({ ...prev, text: accumulatedText }));
                onChunk?.(data.text);
              } else if (data.type === 'done') {
                onComplete?.(data.fullText);
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }

        setState((prev) => ({ ...prev, isStreaming: false }));
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // Request was cancelled
          setState((prev) => ({ ...prev, isStreaming: false }));
          return;
        }

        const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
        setState({ isStreaming: false, text: '', error: errorMessage });
        onError?.(errorMessage);
      }
    },
    [sessionId, onChunk, onComplete, onError]
  );

  const stopAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const clearAnalysis = useCallback(() => {
    setState({ isStreaming: false, text: '', error: null });
  }, []);

  return {
    ...state,
    startAnalysis,
    stopAnalysis,
    clearAnalysis,
  };
}

export default useStreamingAnalysis;
