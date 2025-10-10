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
        {/* Professional human female interviewer image */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces"
          alt="Your Interviewer"
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient for better integration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>

        {/* Speaking indicator overlay */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-blue-400/20 animate-pulse"></div>
        )}
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
        <span className="text-xs font-medium text-gray-500">Your Interviewer</span>
      </div>
    </div>
  );
}
