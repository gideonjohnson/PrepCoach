'use client';

interface AIAvatarProps {
  isSpeaking: boolean;
}

export default function AIAvatar({ isSpeaking }: AIAvatarProps) {
  return (
    <div className="relative inline-block mb-6">
      {/* Outer glow ring when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse blur-2xl opacity-40"></div>
      )}

      {/* Avatar container */}
      <div className={`relative w-40 h-40 rounded-full overflow-hidden transition-all duration-300 ${isSpeaking ? 'scale-110 shadow-2xl ring-4 ring-blue-400/50' : 'scale-100 shadow-xl'}`}>
        {/* Professional human-like avatar using SVG */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffd1a0', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ffb380', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle cx="100" cy="100" r="100" fill="url(#bgGradient)" />

          {/* Head/Face */}
          <ellipse cx="100" cy="110" rx="45" ry="55" fill="url(#skinGradient)" />

          {/* Neck */}
          <rect x="85" y="155" width="30" height="20" fill="#ffb380" />

          {/* Shoulders/Suit */}
          <path d="M 50 175 Q 100 165, 150 175 L 150 200 L 50 200 Z" fill="#2c3e50" />

          {/* Shirt collar */}
          <path d="M 85 165 L 80 180 L 100 175 L 120 180 L 115 165" fill="white" />

          {/* Hair */}
          <ellipse cx="100" cy="75" rx="48" ry="35" fill="#2c3e50" />
          <path d="M 52 90 Q 55 70, 70 65 Q 85 60, 100 58 Q 115 60, 130 65 Q 145 70, 148 90" fill="#2c3e50" />

          {/* Ears */}
          <ellipse cx="52" cy="110" rx="8" ry="12" fill="#ffb380" />
          <ellipse cx="148" cy="110" rx="8" ry="12" fill="#ffb380" />

          {/* Eyebrows */}
          <path d="M 70 95 Q 80 92, 90 95" stroke="#5a4a42" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 110 95 Q 120 92, 130 95" stroke="#5a4a42" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Eyes */}
          <ellipse cx="80" cy="105" rx="8" ry="9" fill="white" />
          <ellipse cx="120" cy="105" rx="8" ry="9" fill="white" />

          {/* Pupils - animated when speaking */}
          <circle cx="80" cy="106" r="4" fill="#2c3e50" className={isSpeaking ? 'animate-pulse' : ''} />
          <circle cx="120" cy="106" r="4" fill="#2c3e50" className={isSpeaking ? 'animate-pulse' : ''} />

          {/* Eye highlights */}
          <circle cx="82" cy="104" r="2" fill="white" opacity="0.8" />
          <circle cx="122" cy="104" r="2" fill="white" opacity="0.8" />

          {/* Nose */}
          <path d="M 100 110 L 98 125 Q 100 127, 102 125 Z" fill="#ffb380" opacity="0.6" />

          {/* Mouth - changes based on speaking state */}
          {isSpeaking ? (
            <>
              {/* Open mouth when speaking */}
              <ellipse cx="100" cy="138" rx="12" ry="10" fill="#8b4513" opacity="0.7" className="animate-pulse" />
              <ellipse cx="100" cy="135" rx="10" ry="7" fill="#d4696a" opacity="0.6" />
            </>
          ) : (
            <>
              {/* Gentle smile when not speaking */}
              <path d="M 85 135 Q 100 142, 115 135" stroke="#8b4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Lower lip */}
              <path d="M 88 138 Q 100 143, 112 138" stroke="#d4696a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
            </>
          )}

          {/* Cheeks - subtle blush */}
          <ellipse cx="70" cy="120" rx="12" ry="8" fill="#ff9999" opacity="0.15" />
          <ellipse cx="130" cy="120" rx="12" ry="8" fill="#ff9999" opacity="0.15" />
        </svg>
      </div>

      {/* Sound waves animation when speaking */}
      {isSpeaking && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '600ms' }}></div>
            <div className="w-1.5 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '600ms' }}></div>
            <div className="w-1.5 h-5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '600ms' }}></div>
            <div className="w-1.5 h-7 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '600ms' }}></div>
            <div className="w-1.5 h-5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '600ms' }}></div>
          </div>
        </div>
      )}

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium text-gray-500">AI Interviewer</span>
      </div>
    </div>
  );
}
