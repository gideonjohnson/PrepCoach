'use client';

import { useState } from 'react';

export interface InterviewerSettings {
  type: 'animated' | 'realistic';
  gender: 'male' | 'female' | 'neutral';
  accent: 'american' | 'british' | 'australian' | 'indian' | 'neutral';
  tone: 'professional' | 'friendly' | 'strict' | 'encouraging';
  avatarId?: string; // For D-ID avatar selection
  voiceId?: string; // For ElevenLabs voice ID
}

interface InterviewerConfigProps {
  onSave: (settings: InterviewerSettings) => void;
  onClose: () => void;
  currentSettings?: InterviewerSettings;
}

const REALISTIC_AVATARS = {
  male: [
    { id: 'elon-musk-tech-ceo', name: 'Tech CEO (Elon Musk Style)', preview: '/avatars/elon.jpg', description: 'Innovative tech leader' },
    { id: 'steve-jobs-visionary', name: 'Visionary Leader (Steve Jobs Style)', preview: '/avatars/steve.jpg', description: 'Product perfectionist' },
    { id: 'mark-zuckerberg-founder', name: 'Startup Founder (Mark Zuckerberg Style)', preview: '/avatars/mark.jpg', description: 'Social media pioneer' },
    { id: 'jeff-bezos-ceo', name: 'Business Magnate (Jeff Bezos Style)', preview: '/avatars/jeff.jpg', description: 'Customer-obsessed leader' },
    { id: 'bill-gates-tech', name: 'Tech Pioneer (Bill Gates Style)', preview: '/avatars/bill.jpg', description: 'Software visionary' },
    { id: 'professional-male-1', name: 'Professional Executive', preview: '/avatars/male1.jpg', description: 'Corporate interviewer' },
  ],
  female: [
    { id: 'sheryl-sandberg-coo', name: 'COO Leader (Sheryl Sandberg Style)', preview: '/avatars/sheryl.jpg', description: 'Operations expert' },
    { id: 'marissa-mayer-ceo', name: 'Tech CEO (Marissa Mayer Style)', preview: '/avatars/marissa.jpg', description: 'Product-focused leader' },
    { id: 'ginni-rometty-ibm', name: 'Enterprise Leader (Ginni Rometty Style)', preview: '/avatars/ginni.jpg', description: 'Strategic thinker' },
    { id: 'susan-wojcicki-youtube', name: 'Platform CEO (Susan Wojcicki Style)', preview: '/avatars/susan.jpg', description: 'Media innovator' },
    { id: 'professional-female-1', name: 'Professional Executive', preview: '/avatars/female1.jpg', description: 'Corporate interviewer' },
  ],
  neutral: [
    { id: 'professional-neutral', name: 'Professional Interviewer', preview: '/avatars/neutral1.jpg', description: 'Balanced approach' },
  ]
};

const VOICE_OPTIONS = {
  male: {
    american: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (American)' },
    british: { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (British)' },
    australian: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Australian)' },
    indian: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam (Indian)' },
    neutral: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Neutral)' },
  },
  female: {
    american: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (American)' },
    british: { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy (British)' },
    australian: { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily (Australian)' },
    indian: { id: 'cgSgspJ2msm6clMCkdW9', name: 'Domi (Indian)' },
    neutral: { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Neutral)' },
  },
  neutral: {
    american: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Neutral (American)' },
    british: { id: 'VR6AewLTigWG4xSOukaG', name: 'Neutral (British)' },
    australian: { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Neutral (Australian)' },
    indian: { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Neutral (Indian)' },
    neutral: { id: 'ErXwobaYiN019PkySvjV', name: 'Neutral' },
  }
};

export default function InterviewerConfig({ onSave, onClose, currentSettings }: InterviewerConfigProps) {
  const [settings, setSettings] = useState<InterviewerSettings>(currentSettings || {
    type: 'realistic',
    gender: 'female',
    accent: 'american',
    tone: 'professional',
    avatarId: 'professional-female-1',
    voiceId: 'en-US-JennyNeural',
  });

  const [selectedAvatarId, setSelectedAvatarId] = useState(currentSettings?.avatarId || 'professional-female-1');

  const handleSave = () => {
    const finalSettings = { ...settings };

    // Set avatar ID based on selection
    if (settings.type === 'realistic' && selectedAvatarId) {
      finalSettings.avatarId = selectedAvatarId;
    }

    // Set voice ID based on gender and accent
    const voiceConfig = VOICE_OPTIONS[settings.gender][settings.accent];
    finalSettings.voiceId = voiceConfig.id;

    onSave(finalSettings);
  };

  const avatarOptions = settings.type === 'realistic' ? REALISTIC_AVATARS[settings.gender] : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🎭 Customize Your AI Interviewer</h2>
              <p className="text-blue-100">Choose your preferred interviewer style, voice, and personality</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar Type Selection */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👤</span> Interviewer Type
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setSettings({ ...settings, type: 'animated' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  settings.type === 'animated'
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="text-5xl mb-3">🎨</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Animated Avatar</h4>
                <p className="text-sm text-gray-600">Friendly animated character with dynamic expressions</p>
                {settings.type === 'animated' && (
                  <div className="mt-3 flex items-center gap-2 text-purple-600 font-semibold text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selected
                  </div>
                )}
              </button>

              <button
                onClick={() => setSettings({ ...settings, type: 'realistic' })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  settings.type === 'realistic'
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="text-5xl mb-3">🧑‍💼</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Realistic AI Human</h4>
                <p className="text-sm text-gray-600">Photorealistic interviewer with natural expressions and lip-sync</p>
                {settings.type === 'realistic' && (
                  <div className="mt-3 flex items-center gap-2 text-purple-600 font-semibold text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selected
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Realistic Avatar Selection */}
          {settings.type === 'realistic' && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🎬</span> Select Celebrity Interviewer
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose a celebrity-style interviewer to match your industry and role
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedAvatarId === avatar.id
                        ? 'border-blue-500 shadow-xl scale-105 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                      {/* Placeholder celebrity icon */}
                      <div className="text-7xl">
                        {avatar.id.includes('elon') && '🚀'}
                        {avatar.id.includes('steve') && '🍎'}
                        {avatar.id.includes('mark') && '👥'}
                        {avatar.id.includes('jeff') && '📦'}
                        {avatar.id.includes('bill') && '💻'}
                        {avatar.id.includes('sheryl') && '💼'}
                        {avatar.id.includes('marissa') && '🎨'}
                        {avatar.id.includes('ginni') && '🏢'}
                        {avatar.id.includes('susan') && '📺'}
                        {!avatar.id.includes('elon') && !avatar.id.includes('steve') && !avatar.id.includes('mark') &&
                         !avatar.id.includes('jeff') && !avatar.id.includes('bill') && !avatar.id.includes('sheryl') &&
                         !avatar.id.includes('marissa') && !avatar.id.includes('ginni') && !avatar.id.includes('susan') && '👔'}
                      </div>
                      {selectedAvatarId === avatar.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2 shadow-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-bold text-sm text-gray-900 mb-1">{avatar.name}</p>
                      <p className="text-xs text-gray-600">{avatar.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <span className="font-semibold">Note:</span> These are AI-generated avatars styled after famous business leaders, not actual celebrities. Perfect for realistic interview practice!
                </p>
              </div>
            </div>
          )}

          {/* Gender Selection */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚧</span> Voice Gender
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {(['male', 'female', 'neutral'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSettings({ ...settings, gender, accent: 'american' })}
                  className={`p-4 rounded-xl border-2 font-semibold capitalize transition-all ${
                    settings.gender === gender
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Selection */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🌍</span> Accent
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(['american', 'british', 'australian', 'indian', 'neutral'] as const).map((accent) => (
                <button
                  key={accent}
                  onClick={() => setSettings({ ...settings, accent })}
                  className={`p-3 rounded-lg border-2 font-semibold capitalize transition-all ${
                    settings.accent === accent
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                      : 'border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {accent}
                </button>
              ))}
            </div>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Selected Voice:</span>{' '}
                {VOICE_OPTIONS[settings.gender][settings.accent].name}
              </p>
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎭</span> Interview Tone
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {([
                { value: 'professional', icon: '💼', desc: 'Formal and business-like' },
                { value: 'friendly', icon: '😊', desc: 'Warm and approachable' },
                { value: 'strict', icon: '🎯', desc: 'Direct and challenging' },
                { value: 'encouraging', icon: '✨', desc: 'Supportive and positive' },
              ] as const).map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSettings({ ...settings, tone: tone.value })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.tone === tone.value
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{tone.icon}</div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1 capitalize">{tone.value}</h4>
                  <p className="text-xs text-gray-600">{tone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition transform hover:scale-105"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
