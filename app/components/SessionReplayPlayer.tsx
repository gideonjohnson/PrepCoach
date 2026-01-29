'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface TimestampEvent {
  time: number;
  event: string;
  data?: Record<string, unknown>;
}

interface SessionReplayPlayerProps {
  audioUrl?: string;
  videoUrl?: string;
  screenUrl?: string;
  timestamps: TimestampEvent[];
  duration: number;
  transcription?: string;
  codeSnapshots?: Array<{ timestamp: number; code: string }>;
  diagramSnapshots?: Array<{ timestamp: number; data: Record<string, unknown> }>;
  onTimestampClick?: (timestamp: TimestampEvent) => void;
}

export default function SessionReplayPlayer({
  audioUrl,
  videoUrl,
  screenUrl,
  timestamps,
  duration,
  transcription,
  codeSnapshots,
  diagramSnapshots,
  onTimestampClick,
}: SessionReplayPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeView, setActiveView] = useState<'video' | 'screen' | 'code' | 'diagram'>('video');
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Sync media elements
  useEffect(() => {
    const syncMedia = () => {
      if (audioRef.current) audioRef.current.playbackRate = playbackRate;
      if (videoRef.current) videoRef.current.playbackRate = playbackRate;
      if (screenRef.current) screenRef.current.playbackRate = playbackRate;
    };
    syncMedia();
  }, [playbackRate]);

  // Update current time
  useEffect(() => {
    const primaryMedia = audioRef.current || videoRef.current;
    if (!primaryMedia) return;

    const handleTimeUpdate = () => {
      setCurrentTime(primaryMedia.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    primaryMedia.addEventListener('timeupdate', handleTimeUpdate);
    primaryMedia.addEventListener('ended', handleEnded);

    return () => {
      primaryMedia.removeEventListener('timeupdate', handleTimeUpdate);
      primaryMedia.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, videoUrl]);

  const togglePlayPause = useCallback(() => {
    const primaryMedia = audioRef.current || videoRef.current;
    if (!primaryMedia) return;

    if (isPlaying) {
      primaryMedia.pause();
      videoRef.current?.pause();
      screenRef.current?.pause();
    } else {
      primaryMedia.play();
      if (videoRef.current && videoRef.current !== primaryMedia) {
        videoRef.current.currentTime = primaryMedia.currentTime;
        videoRef.current.play();
      }
      if (screenRef.current) {
        screenRef.current.currentTime = primaryMedia.currentTime;
        screenRef.current.play();
      }
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(time, duration));

    if (audioRef.current) audioRef.current.currentTime = clampedTime;
    if (videoRef.current) videoRef.current.currentTime = clampedTime;
    if (screenRef.current) screenRef.current.currentTime = clampedTime;

    setCurrentTime(clampedTime);
  }, [duration]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    seekTo(clickPosition * duration);
  };

  const skipForward = () => seekTo(currentTime + 10);
  const skipBackward = () => seekTo(currentTime - 10);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current code snapshot based on time
  const currentCodeSnapshot = codeSnapshots?.reduce((acc, snapshot) => {
    if (snapshot.timestamp <= currentTime * 1000) return snapshot;
    return acc;
  }, codeSnapshots[0]);

  // Get current diagram snapshot based on time
  const currentDiagramSnapshot = diagramSnapshots?.reduce((acc, snapshot) => {
    if (snapshot.timestamp <= currentTime * 1000) return snapshot;
    return acc;
  }, diagramSnapshots[0]);

  // Get timestamps near current time
  const nearbyTimestamps = timestamps.filter(
    (ts) => Math.abs(ts.time / 1000 - currentTime) < 30
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Video/Content area */}
        <div className="flex-1 relative bg-black">
          {/* Video/Screen view */}
          {(activeView === 'video' || activeView === 'screen') && (
            <div className="absolute inset-0 flex items-center justify-center">
              {activeView === 'video' && videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="max-w-full max-h-full"
                  playsInline
                />
              ) : activeView === 'screen' && screenUrl ? (
                <video
                  ref={screenRef}
                  src={screenUrl}
                  className="max-w-full max-h-full"
                  playsInline
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p>No {activeView} recording available</p>
                </div>
              )}
            </div>
          )}

          {/* Code view */}
          {activeView === 'code' && (
            <div className="absolute inset-0 overflow-auto p-4">
              {currentCodeSnapshot ? (
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                  {currentCodeSnapshot.code}
                </pre>
              ) : (
                <div className="text-gray-500 text-center pt-20">
                  <div className="text-4xl mb-2">💻</div>
                  <p>No code snapshots available</p>
                </div>
              )}
            </div>
          )}

          {/* Diagram view */}
          {activeView === 'diagram' && (
            <div className="absolute inset-0 flex items-center justify-center">
              {currentDiagramSnapshot ? (
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">📐</div>
                  <p>Diagram snapshot at {formatTime(currentDiagramSnapshot.timestamp / 1000)}</p>
                  {/* In a real implementation, render the Excalidraw diagram here */}
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">📐</div>
                  <p>No diagram snapshots available</p>
                </div>
              )}
            </div>
          )}

          {/* View switcher overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            {videoUrl && (
              <button
                onClick={() => setActiveView('video')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeView === 'video'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Video
              </button>
            )}
            {screenUrl && (
              <button
                onClick={() => setActiveView('screen')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeView === 'screen'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Screen
              </button>
            )}
            {codeSnapshots && codeSnapshots.length > 0 && (
              <button
                onClick={() => setActiveView('code')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeView === 'code'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Code
              </button>
            )}
            {diagramSnapshots && diagramSnapshots.length > 0 && (
              <button
                onClick={() => setActiveView('diagram')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeView === 'diagram'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Diagram
              </button>
            )}
          </div>
        </div>

        {/* Sidebar - Timeline & Transcript */}
        <div className="w-72 border-l border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowTranscript(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                !showTranscript
                  ? 'text-white border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Events
            </button>
            {transcription && (
              <button
                onClick={() => setShowTranscript(true)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  showTranscript
                    ? 'text-white border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Transcript
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {showTranscript && transcription ? (
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {transcription}
              </p>
            ) : (
              <div className="space-y-2">
                {timestamps.map((ts, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      seekTo(ts.time / 1000);
                      onTimestampClick?.(ts);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      nearbyTimestamps.includes(ts)
                        ? 'bg-orange-500/20 border border-orange-500/50'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-400">
                        {formatTime(ts.time / 1000)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {ts.event}
                      </span>
                    </div>
                    {ts.data && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {JSON.stringify(ts.data)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio element (hidden) */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="h-2 bg-gray-700 cursor-pointer group"
      >
        <div
          className="h-full bg-orange-500 relative"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Timestamp markers */}
        {timestamps.map((ts, index) => (
          <div
            key={index}
            className="absolute top-0 h-full w-0.5 bg-blue-500"
            style={{ left: `${(ts.time / 1000 / duration) * 100}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
        {/* Left controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={skipBackward}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Skip back 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={skipForward}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Skip forward 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>

          {/* Time display */}
          <span className="text-sm text-gray-300 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Playback speed */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="px-2 py-1 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-orange-500"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
