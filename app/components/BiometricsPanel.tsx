'use client';

import { VocalMetrics, VisualMetrics, StressMetrics } from '../practice/biometrics/types';

interface BiometricsPanelProps {
  vocalMetrics: Partial<VocalMetrics> | null;
  visualMetrics?: Partial<VisualMetrics> | null;
  stressMetrics?: Partial<StressMetrics> | null;
  isActive: boolean;
}

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  unit?: string;
  helpText?: string;
}

function MetricCard({ icon, label, value, status, unit, helpText }: MetricCardProps) {
  const statusColors = {
    excellent: 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50',
    good: 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50',
    warning: 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50',
    poor: 'border-red-500 bg-gradient-to-br from-red-50 to-rose-50',
  };

  const statusTextColors = {
    excellent: 'text-green-700',
    good: 'text-blue-700',
    warning: 'text-yellow-700',
    poor: 'text-red-700',
  };

  const statusBadgeColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    poor: 'bg-red-500',
  };

  return (
    <div className={`relative rounded-xl p-4 border-2 ${statusColors[status]} transform-3d-child hover-lift-3d transition-all duration-300 group`}>
      {/* Status indicator */}
      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusBadgeColors[status]} animate-pulse`} />

      <div className="flex items-start gap-3">
        <div className="text-3xl transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className={`text-2xl font-bold ${statusTextColors[status]} truncate`}>
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </div>
          {helpText && (
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
              {helpText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BiometricsPanel({
  vocalMetrics,
  visualMetrics,
  stressMetrics,
  isActive
}: BiometricsPanelProps) {
  if (!isActive) return null;

  // Helper function to determine status based on value ranges
  const getPaceStatus = (pace: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (pace >= 130 && pace <= 150) return 'excellent';
    if (pace >= 120 && pace <= 160) return 'good';
    if (pace >= 110 && pace <= 170) return 'warning';
    return 'poor';
  };

  const getVolumeStatus = (volume: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (volume >= 50 && volume <= 75) return 'excellent';
    if (volume >= 40 && volume <= 85) return 'good';
    if (volume >= 30 && volume <= 95) return 'warning';
    return 'poor';
  };

  const getFillerWordStatus = (count: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (count <= 3) return 'excellent';
    if (count <= 7) return 'good';
    if (count <= 15) return 'warning';
    return 'poor';
  };

  const getClarityStatus = (clarity: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (clarity >= 80) return 'excellent';
    if (clarity >= 65) return 'good';
    if (clarity >= 50) return 'warning';
    return 'poor';
  };

  const getEyeContactStatus = (percentage: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'warning';
    return 'poor';
  };

  const getConfidenceStatus = (score: number): 'excellent' | 'good' | 'warning' | 'poor' => {
    if (score >= 71) return 'excellent';
    if (score >= 51) return 'good';
    if (score >= 31) return 'warning';
    return 'poor';
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-xl animate-fadeIn [box-shadow:0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Live Biometrics</h3>
            <p className="text-xs text-gray-500">Real-time performance analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Active
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transform-3d">
        {/* Vocal Metrics */}
        {vocalMetrics && (
          <>
            {typeof vocalMetrics.pace === 'number' && vocalMetrics.pace > 0 && (
              <MetricCard
                icon="🎙️"
                label="Speaking Pace"
                value={vocalMetrics.pace}
                unit="WPM"
                status={getPaceStatus(vocalMetrics.pace)}
                helpText="Ideal: 130-150 WPM"
              />
            )}

            {typeof vocalMetrics.volume === 'number' && (
              <MetricCard
                icon="📊"
                label="Volume"
                value={`${vocalMetrics.volume}%`}
                unit=""
                status={getVolumeStatus(vocalMetrics.volume)}
                helpText="Maintain consistent volume"
              />
            )}

            {typeof vocalMetrics.fillerWordCount === 'number' && (
              <MetricCard
                icon="💬"
                label="Filler Words"
                value={vocalMetrics.fillerWordCount}
                unit=""
                status={getFillerWordStatus(vocalMetrics.fillerWordCount)}
                helpText="Um, uh, like, you know..."
              />
            )}

            {typeof vocalMetrics.clarity === 'number' && (
              <MetricCard
                icon="✨"
                label="Clarity Score"
                value={vocalMetrics.clarity}
                unit="/100"
                status={getClarityStatus(vocalMetrics.clarity)}
                helpText="Overall speech quality"
              />
            )}

            {typeof vocalMetrics.pauseCount === 'number' && (
              <MetricCard
                icon="⏸️"
                label="Pauses"
                value={vocalMetrics.pauseCount}
                unit=""
                status={vocalMetrics.pauseCount <= 8 ? 'good' : 'warning'}
                helpText="Natural pauses detected"
              />
            )}

            {typeof vocalMetrics.energyLevel === 'number' && (
              <MetricCard
                icon="⚡"
                label="Energy Level"
                value={vocalMetrics.energyLevel}
                unit="/100"
                status={vocalMetrics.energyLevel >= 60 ? 'excellent' : vocalMetrics.energyLevel >= 40 ? 'good' : 'warning'}
                helpText="Speech enthusiasm"
              />
            )}
          </>
        )}

        {/* Visual Metrics (if available) */}
        {visualMetrics && (
          <>
            {typeof visualMetrics.eyeContactPercentage === 'number' && (
              <MetricCard
                icon="👁️"
                label="Eye Contact"
                value={`${visualMetrics.eyeContactPercentage}%`}
                unit=""
                status={getEyeContactStatus(visualMetrics.eyeContactPercentage)}
                helpText="Looking at camera"
              />
            )}

            {typeof visualMetrics.postureScore === 'number' && (
              <MetricCard
                icon="🧍"
                label="Posture"
                value={visualMetrics.postureScore}
                unit="/100"
                status={visualMetrics.postureScore >= 70 ? 'excellent' : visualMetrics.postureScore >= 50 ? 'good' : 'warning'}
                helpText="Body alignment"
              />
            )}

            {typeof visualMetrics.facialConfidence === 'number' && (
              <MetricCard
                icon="😊"
                label="Expression"
                value={visualMetrics.facialConfidence}
                unit="/100"
                status={visualMetrics.facialConfidence >= 70 ? 'excellent' : visualMetrics.facialConfidence >= 50 ? 'good' : 'warning'}
                helpText="Facial confidence"
              />
            )}
          </>
        )}

        {/* Stress Metrics (if available) */}
        {stressMetrics && (
          <>
            {typeof stressMetrics.confidenceScore === 'number' && (
              <MetricCard
                icon="💚"
                label="Confidence"
                value={stressMetrics.confidenceScore}
                unit="/100"
                status={getConfidenceStatus(stressMetrics.confidenceScore)}
                helpText="Overall confidence level"
              />
            )}

            {typeof stressMetrics.estimatedHeartRate === 'number' && (
              <MetricCard
                icon="💓"
                label="Heart Rate"
                value={stressMetrics.estimatedHeartRate}
                unit="BPM"
                status={stressMetrics.estimatedHeartRate < 90 ? 'excellent' : stressMetrics.estimatedHeartRate < 110 ? 'good' : 'warning'}
                helpText="Estimated from video"
              />
            )}

            {typeof stressMetrics.overallStressLevel === 'number' && (
              <MetricCard
                icon="🧘"
                label="Stress Level"
                value={stressMetrics.overallStressLevel}
                unit="/100"
                status={stressMetrics.overallStressLevel < 40 ? 'excellent' : stressMetrics.overallStressLevel < 60 ? 'good' : 'warning'}
                helpText="Stay calm and focused"
              />
            )}
          </>
        )}
      </div>

      {/* Performance Summary & Tips */}
      {vocalMetrics && (
        <div className="mt-6 space-y-4">
          {/* Overall Performance Score */}
          <div className="p-5 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-purple-900">Overall Vocal Performance</h4>
              {(() => {
                // Calculate overall score
                let totalScore = 0;
                let metricsCount = 0;

                if (typeof vocalMetrics.pace === 'number' && vocalMetrics.pace > 0) {
                  const paceScore = vocalMetrics.pace >= 130 && vocalMetrics.pace <= 150 ? 100 :
                                    vocalMetrics.pace >= 120 && vocalMetrics.pace <= 160 ? 80 :
                                    vocalMetrics.pace >= 110 && vocalMetrics.pace <= 170 ? 60 : 40;
                  totalScore += paceScore;
                  metricsCount++;
                }

                if (typeof vocalMetrics.volume === 'number') {
                  const volumeScore = vocalMetrics.volume >= 50 && vocalMetrics.volume <= 75 ? 100 :
                                      vocalMetrics.volume >= 40 && vocalMetrics.volume <= 85 ? 80 :
                                      vocalMetrics.volume >= 30 && vocalMetrics.volume <= 95 ? 60 : 40;
                  totalScore += volumeScore;
                  metricsCount++;
                }

                if (typeof vocalMetrics.fillerWordCount === 'number') {
                  const fillerScore = vocalMetrics.fillerWordCount <= 3 ? 100 :
                                      vocalMetrics.fillerWordCount <= 7 ? 80 :
                                      vocalMetrics.fillerWordCount <= 15 ? 60 : 40;
                  totalScore += fillerScore;
                  metricsCount++;
                }

                if (typeof vocalMetrics.clarity === 'number') {
                  totalScore += vocalMetrics.clarity;
                  metricsCount++;
                }

                const avgScore = metricsCount > 0 ? Math.round(totalScore / metricsCount) : 0;
                const grade = avgScore >= 90 ? 'A+' :
                              avgScore >= 85 ? 'A' :
                              avgScore >= 80 ? 'A-' :
                              avgScore >= 75 ? 'B+' :
                              avgScore >= 70 ? 'B' :
                              avgScore >= 65 ? 'B-' :
                              avgScore >= 60 ? 'C+' : 'C';

                const gradeColor = avgScore >= 80 ? 'text-green-700' :
                                   avgScore >= 65 ? 'text-blue-700' :
                                   avgScore >= 50 ? 'text-yellow-700' : 'text-orange-700';

                return (
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl font-bold ${gradeColor}`}>{grade}</div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${gradeColor}`}>{avgScore}/100</div>
                      <div className="text-xs text-gray-500">Performance Score</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Progress Bar */}
            {(() => {
              let totalScore = 0;
              let metricsCount = 0;

              if (typeof vocalMetrics.pace === 'number' && vocalMetrics.pace > 0) {
                const paceScore = vocalMetrics.pace >= 130 && vocalMetrics.pace <= 150 ? 100 :
                                  vocalMetrics.pace >= 120 && vocalMetrics.pace <= 160 ? 80 :
                                  vocalMetrics.pace >= 110 && vocalMetrics.pace <= 170 ? 60 : 40;
                totalScore += paceScore;
                metricsCount++;
              }

              if (typeof vocalMetrics.volume === 'number') {
                const volumeScore = vocalMetrics.volume >= 50 && vocalMetrics.volume <= 75 ? 100 :
                                    vocalMetrics.volume >= 40 && vocalMetrics.volume <= 85 ? 80 :
                                    vocalMetrics.volume >= 30 && vocalMetrics.volume <= 95 ? 60 : 40;
                totalScore += volumeScore;
                metricsCount++;
              }

              if (typeof vocalMetrics.fillerWordCount === 'number') {
                const fillerScore = vocalMetrics.fillerWordCount <= 3 ? 100 :
                                    vocalMetrics.fillerWordCount <= 7 ? 80 :
                                    vocalMetrics.fillerWordCount <= 15 ? 60 : 40;
                totalScore += fillerScore;
                metricsCount++;
              }

              if (typeof vocalMetrics.clarity === 'number') {
                totalScore += vocalMetrics.clarity;
                metricsCount++;
              }

              const avgScore = metricsCount > 0 ? Math.round(totalScore / metricsCount) : 0;
              const barColor = avgScore >= 80 ? 'bg-green-500' :
                               avgScore >= 65 ? 'bg-blue-500' :
                               avgScore >= 50 ? 'bg-yellow-500' : 'bg-orange-500';

              return (
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${avgScore}%` }}
                  />
                </div>
              );
            })()}
          </div>

          {/* Live Performance Tip */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">💡 Real-Time Coaching</h4>
                <p className="text-xs text-blue-700 mb-2">
                  {vocalMetrics.pace && vocalMetrics.pace < 120
                    ? "📈 Increase your pace slightly - aim for 130-150 words per minute for optimal engagement."
                    : vocalMetrics.pace && vocalMetrics.pace > 160
                    ? "⏱️ Slow down a bit - speaking too quickly can reduce clarity and make you harder to follow."
                    : vocalMetrics.fillerWordCount && vocalMetrics.fillerWordCount > 7
                    ? "🎯 Reduce filler words (um, uh, like, you know) - take brief pauses instead when you need to think."
                    : vocalMetrics.volume && vocalMetrics.volume < 40
                    ? "🔊 Speak louder and project your voice - confidence comes through in volume and clarity."
                    : vocalMetrics.energyLevel && vocalMetrics.energyLevel < 50
                    ? "⚡ Inject more enthusiasm into your delivery - vary your tone and emphasize key points."
                    : "🌟 Excellent work! Your vocal delivery is strong. Keep maintaining this professional performance."}
                </p>
                {/* Additional Strengths */}
                {(() => {
                  const strengths: string[] = [];
                  if (typeof vocalMetrics.pace === 'number' && vocalMetrics.pace >= 130 && vocalMetrics.pace <= 150) {
                    strengths.push('Perfect pacing');
                  }
                  if (typeof vocalMetrics.fillerWordCount === 'number' && vocalMetrics.fillerWordCount <= 3) {
                    strengths.push('Minimal filler words');
                  }
                  if (typeof vocalMetrics.clarity === 'number' && vocalMetrics.clarity >= 80) {
                    strengths.push('Excellent clarity');
                  }
                  if (typeof vocalMetrics.energyLevel === 'number' && vocalMetrics.energyLevel >= 60) {
                    strengths.push('High energy');
                  }

                  if (strengths.length > 0) {
                    return (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs font-medium text-blue-800">Strengths:</span>
                        {strengths.map((strength, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                            ✓ {strength}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No data message */}
      {!vocalMetrics && !visualMetrics && !stressMetrics && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            Start recording to see live biometric feedback
          </p>
        </div>
      )}
    </div>
  );
}
