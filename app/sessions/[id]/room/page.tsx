'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import VideoRoom from '@/app/components/VideoRoom';

type RoomData = {
  roomUrl: string;
  token: string;
  participantName: string;
  isInterviewer: boolean;
  sessionType: string;
  duration: number;
  endsAt: string;
};

export default function SessionRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      joinRoom();
    }
  }, [status, id]);

  const joinRoom = async () => {
    try {
      const response = await fetch(`/api/sessions/${id}/room`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join room');
      }

      setRoomData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    router.push(`/sessions/${id}`);
  };

  const handleEndSession = async () => {
    try {
      await fetch(`/api/sessions/${id}/room`, {
        method: 'DELETE',
      });
      router.push(`/sessions/${id}?ended=true`);
    } catch (err) {
      console.error('Error ending session:', err);
      router.push(`/sessions/${id}`);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        </div>
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Cannot Join Session</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            href={`/sessions/${id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Back to Session
          </Link>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return null;
  }

  // Pre-join lobby
  if (!joined) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute top-0 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl rounded-2xl p-8 shadow-lg border-2 border-white/10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Ready to Join?</h1>
            <p className="text-gray-400 mb-8">
              You&apos;re about to join your {roomData.sessionType.replace('_', ' ')} session
            </p>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                  {roomData.participantName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">{roomData.participantName}</p>
                  <p className="text-gray-400 text-sm">
                    {roomData.isInterviewer ? 'Interviewer' : 'Candidate'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="text-white">{roomData.duration} minutes</p>
                </div>
                <div>
                  <p className="text-gray-500">Ends at</p>
                  <p className="text-white">
                    {new Date(roomData.endsAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>✓</span>
                <span>Your camera and microphone will be requested</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>✓</span>
                <span>Session will be recorded for review</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>✓</span>
                <span>Screen sharing is available</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href={`/sessions/${id}`}
                className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700"
              >
                Cancel
              </Link>
              <button
                onClick={() => setJoined(true)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:shadow-lg"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // In video call
  return (
    <VideoRoom
      roomUrl={roomData.roomUrl}
      token={roomData.token}
      participantName={roomData.participantName}
      isInterviewer={roomData.isInterviewer}
      onLeave={handleLeave}
      onEnd={roomData.isInterviewer ? handleEndSession : undefined}
    />
  );
}
