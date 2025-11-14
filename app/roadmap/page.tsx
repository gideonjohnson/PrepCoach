'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserProfile,
  Skill,
  SkillsGapAnalysis,
  LearningPath,
  CareerTimeline,
  CertificationRecommendation,
  Milestone,
} from './types';
import { analyzeSkillsGap, getSkillDevelopmentRecommendations } from './skillsGapAnalyzer';
import { generateLearningPaths } from './learningPathGenerator';
import { generateCareerTimeline, generateMilestones } from './timelineCalculator';
import { generateCertificationRecommendations, getCertificationPreparationTips, calculateCertificationROI } from './certificationRecommender';
import PaymentGate from '../components/PaymentGate';

function CareerRoadmapContent() {
  const [activeTab, setActiveTab] = useState<'input' | 'gap-analysis' | 'learning-paths' | 'timeline' | 'certifications'>('input');

  // Input state
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(3);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'technical' | 'soft' | 'domain' | 'leadership'>('technical');
  const [selectedProficiency, setSelectedProficiency] = useState<0 | 1 | 2 | 3 | 4 | 5>(3);
  const [timePerWeek, setTimePerWeek] = useState(10);
  const [budget, setBudget] = useState(500);

  // Analysis results
  const [skillsGapAnalysis, setSkillsGapAnalysis] = useState<SkillsGapAnalysis | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [timeline, setTimeline] = useState<CareerTimeline | null>(null);
  const [certifications, setCertifications] = useState<CertificationRecommendation[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // UI state
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkill: Skill = {
        name: skillInput.trim(),
        category: selectedCategory,
        proficiency: selectedProficiency,
      };
      setCurrentSkills([...currentSkills, newSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setCurrentSkills(currentSkills.filter((_, i) => i !== index));
  };

  const handleGenerateRoadmap = () => {
    if (!currentRole || !targetRole || currentSkills.length === 0) {
      alert('Please fill in your current role, target role, and at least one skill');
      return;
    }

    const userProfile: UserProfile = {
      currentRole,
      yearsOfExperience,
      currentSkills,
      education: [],
      certifications: [],
      industries: [],
      strengths: [],
      interests: [],
      constraints: {
        timePerWeek,
        budget,
        preferredLearningStyle: ['video', 'hands-on'],
      },
    };

    // Generate skills gap analysis
    const gapAnalysis = analyzeSkillsGap(userProfile, targetRole);
    setSkillsGapAnalysis(gapAnalysis);

    // Generate learning paths
    const paths = generateLearningPaths(gapAnalysis.gaps, userProfile);
    setLearningPaths(paths);

    // Generate timeline
    const careerTimeline = generateCareerTimeline(gapAnalysis, userProfile, targetRole);
    setTimeline(careerTimeline);

    // Generate milestones
    const roadmapMilestones = generateMilestones(careerTimeline.phases, gapAnalysis);
    setMilestones(roadmapMilestones);

    // Generate certifications
    const certs = generateCertificationRecommendations(gapAnalysis, userProfile, targetRole);
    setCertifications(certs);

    setActiveTab('gap-analysis');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [key]: false });
    }, 2000);
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'ready': return 'text-green-600 bg-green-50';
      case 'advanced': return 'text-blue-600 bg-blue-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'beginner': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block font-medium">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Roadmap Planner</h1>
          <p className="text-lg text-gray-600">
            Get a personalized career development plan with skills gap analysis, learning paths, timeline, and certifications
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { id: 'input', label: '1. Profile & Goals' },
              { id: 'gap-analysis', label: '2. Skills Gap' },
              { id: 'learning-paths', label: '3. Learning Paths' },
              { id: 'timeline', label: '4. Timeline' },
              { id: 'certifications', label: '5. Certifications' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience: {yearsOfExperience}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 years</span>
                  <span>20+ years</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hours per week for learning: {timePerWeek}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={timePerWeek}
                    onChange={(e) => setTimePerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget for courses/certs: ${budget}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Current Skills</h3>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Skill name (e.g., JavaScript)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skills</option>
                    <option value="domain">Domain Knowledge</option>
                    <option value="leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <select
                    value={selectedProficiency}
                    onChange={(e) => setSelectedProficiency(parseInt(e.target.value) as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 - Beginner</option>
                    <option value="2">2 - Basic</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="4">4 - Advanced</option>
                    <option value="5">5 - Expert</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddSkill}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-700 transition mb-6"
              >
                + Add Skill
              </button>

              <div className="space-y-2">
                {currentSkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-500">
                        {skill.category} • Level {skill.proficiency}/5
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {currentSkills.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No skills added yet. Add your skills above.</p>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Generate My Career Roadmap
            </button>
          </div>
        )}

        {/* Gap Analysis Tab */}
        {activeTab === 'gap-analysis' && skillsGapAnalysis && (
          <div className="space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Gap Analysis</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {skillsGapAnalysis.gapScore}%
                  </div>
                  <p className="text-gray-600">Skill Coverage</p>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold px-6 py-2 rounded-lg inline-block ${getReadinessColor(skillsGapAnalysis.readinessLevel)}`}>
                    {skillsGapAnalysis.readinessLevel.toUpperCase()}
                  </div>
                  <p className="text-gray-600 mt-2">Readiness Level</p>
                </div>

                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {skillsGapAnalysis.gaps.length}
                  </div>
                  <p className="text-gray-600">Skill Gaps</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <p className="text-gray-800 text-lg">{skillsGapAnalysis.summary}</p>
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Gaps Breakdown</h3>

              <div className="space-y-4">
                {skillsGapAnalysis.gaps.map((gap, index) => (
                  <div key={index} className={`border-2 rounded-lg p-6 ${getPriorityColor(gap.priority)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{gap.skill}</h4>
                        <div className="flex gap-3 mt-2 text-sm">
                          <span className="px-3 py-1 bg-white rounded-full font-medium">
                            {gap.category}
                          </span>
                          <span className="px-3 py-1 bg-white rounded-full font-medium">
                            {gap.priority.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 bg-white rounded-full font-medium">
                            {gap.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">Time to Learn</div>
                        <div className="text-xl font-bold text-gray-900">{gap.estimatedTimeToLearn}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Current: Level {gap.currentLevel}</span>
                        <span>Required: Level {gap.requiredLevel}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{gap.reasoning}</p>

                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Recommended Actions:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {getSkillDevelopmentRecommendations(gap).map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning Paths Tab */}
        {activeTab === 'learning-paths' && learningPaths.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalized Learning Paths</h2>
              <p className="text-gray-600 mb-6">
                We&apos;ve created {learningPaths.length} customized learning paths based on your skill gaps and learning preferences.
              </p>

              <div className="space-y-8">
                {learningPaths.map((path, index) => (
                  <div key={path.pathId} className="border-2 border-indigo-200 rounded-xl p-6 bg-blue-50 border border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold text-blue-600">#{path.order}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{path.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{path.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="text-lg font-bold text-blue-600">{path.duration}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Difficulty</div>
                        <div className="text-lg font-bold text-purple-600 capitalize">{path.difficulty}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Cost</div>
                        <div className="text-lg font-bold text-green-600">
                          ${path.estimatedCost.min} - ${path.estimatedCost.max}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Resources</div>
                        <div className="text-lg font-bold text-orange-600">{path.resources.length}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Target Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {path.targetSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {path.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">Prerequisites:</h4>
                        <ul className="list-disc list-inside text-gray-700">
                          {path.prerequisites.map((prereq, i) => (
                            <li key={i}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Learning Resources:</h4>
                      <div className="space-y-3">
                        {path.resources.map((resource, i) => (
                          <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium uppercase">
                                    {resource.type}
                                  </span>
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    {resource.difficulty}
                                  </span>
                                </div>
                                <h5 className="font-bold text-gray-900">{resource.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">by {resource.provider}</p>
                                <p className="text-gray-700 text-sm mb-2">{resource.description}</p>
                                <div className="flex gap-4 text-sm text-gray-600">
                                  <span>⏱️ {resource.duration}</span>
                                  <span>💰 {resource.cost === 0 ? 'Free' : `$${resource.cost}`}</span>
                                  {resource.rating && <span>⭐ {resource.rating}/5</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && timeline && (
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Career Transition Timeline</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center bg-indigo-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Total Duration</div>
                  <div className="text-3xl font-bold text-blue-600">{timeline.totalDuration}</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Start Date</div>
                  <div className="text-xl font-bold text-purple-600">{timeline.currentDate}</div>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Target Date</div>
                  <div className="text-xl font-bold text-green-600">{timeline.targetDate}</div>
                </div>
              </div>
            </div>

            {/* Phases */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline Phases</h3>

              <div className="space-y-6">
                {timeline.phases.map((phase, index) => (
                  <div key={phase.phase} className="border-l-4 border-indigo-500 pl-6 pb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-blue-600">Phase {phase.phase}</span>
                      <h4 className="text-xl font-bold text-gray-900">{phase.title}</h4>
                      <span className="ml-auto text-gray-600 font-medium">{phase.duration}</span>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">
                        Months {phase.startMonth + 1} - {phase.endMonth}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${((phase.endMonth - phase.startMonth) / timeline.phases[timeline.phases.length - 1].endMonth) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-gray-900 mb-2">🎯 Goals:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {phase.goals.map((goal, i) => (
                            <li key={i}>{goal}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-bold text-gray-900 mb-2">✅ Activities:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {phase.activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-bold text-gray-900 mb-2">📊 Success Metrics:</h5>
                      <div className="flex flex-wrap gap-2">
                        {phase.successMetrics.map((metric, i) => (
                          <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Key Milestones</h3>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className={`border-2 rounded-lg p-4 ${getPriorityColor(milestone.priority)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {milestone.type === 'skill' && '🎯'}
                            {milestone.type === 'project' && '🚀'}
                            {milestone.type === 'certification' && '🎓'}
                            {milestone.type === 'networking' && '🤝'}
                            {milestone.type === 'application' && '📝'}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-600">Month</div>
                          <div className="text-2xl font-bold text-blue-600">{milestone.targetMonth}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Estimated Effort: {milestone.estimatedEffort}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assumptions & Tips */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-gray-900 mb-4">📋 Assumptions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {timeline.assumptions.map((assumption, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-gray-900 mb-4">⚡ Accelerators</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {timeline.accelerators.map((accelerator, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{accelerator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-gray-900 mb-4">⚠️ Risks</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {timeline.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && certifications.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Certifications</h2>
              <p className="text-gray-600 mb-6">
                Industry-recognized certifications that align with your target role and skill gaps.
              </p>

              <div className="space-y-6">
                {certifications.map((cert, index) => {
                  const roi = calculateCertificationROI(cert);
                  const tips = getCertificationPreparationTips(cert);

                  return (
                    <div key={index} className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50 border border-purple-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🎓</span>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                              <p className="text-gray-600">by {cert.provider}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
                            cert.relevance === 'essential' ? 'bg-red-100 text-red-700' :
                            cert.relevance === 'highly-recommended' ? 'bg-orange-100 text-orange-700' :
                            cert.relevance === 'beneficial' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cert.relevance.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-600">Cost</div>
                          <div className="text-lg font-bold text-purple-600">${cert.cost}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-600">Duration</div>
                          <div className="text-sm font-bold text-blue-600">{cert.duration}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-600">Difficulty</div>
                          <div className="text-sm font-bold text-orange-600 capitalize">{cert.difficulty}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-600">Recognition</div>
                          <div className="text-sm font-bold text-green-600 capitalize">{cert.industryRecognition}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-600">Timeline</div>
                          <div className="text-sm font-bold text-blue-600">{cert.suggestedTimeline}</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">💰 ROI Estimate:</h4>
                          <div className="bg-white rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Salary Increase:</span>
                              <span className="font-bold text-green-600">{roi.estimatedSalaryIncrease}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time to ROI:</span>
                              <span className="font-bold text-blue-600">{roi.timeToROI}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">📋 Exam Details:</h4>
                          <div className="bg-white rounded-lg p-4 space-y-1 text-sm">
                            <div><strong>Format:</strong> {cert.examFormat}</div>
                            {cert.passingScore && <div><strong>Passing Score:</strong> {cert.passingScore}</div>}
                            <div><strong>Renewal:</strong> {cert.renewalRequired ? `Every ${cert.renewalPeriod}` : 'Not required'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">🎯 Skills Covered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {cert.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-900 mb-2">✅ Prerequisites:</h4>
                          <ul className="list-disc list-inside text-gray-700 text-sm">
                            {cert.prerequisites.map((prereq, i) => (
                              <li key={i}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">💡 Benefits:</h4>
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                          {cert.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold text-gray-900 mb-2">📚 Preparation Tips:</h4>
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                          {tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      {cert.preparationResources.length > 0 && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">📖 Preparation Resources:</h4>
                          <div className="space-y-2">
                            {cert.preparationResources.map((resource, i) => (
                              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium text-gray-900">{resource.title}</div>
                                    <div className="text-sm text-gray-600">by {resource.provider}</div>
                                  </div>
                                  <div className="text-right text-sm">
                                    <div className="font-bold text-purple-600">
                                      {resource.cost === 0 ? 'Free' : `$${resource.cost}`}
                                    </div>
                                    <div className="text-gray-600">{resource.duration}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty State for Analysis Tabs */}
        {(activeTab !== 'input' && !skillsGapAnalysis) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Yet</h3>
            <p className="text-gray-600 mb-6">
              Complete the Profile & Goals section and click &quot;Generate My Career Roadmap&quot; to see your personalized analysis.
            </p>
            <button
              onClick={() => setActiveTab('input')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
            >
              Go to Profile & Goals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CareerRoadmapPage() {
  return (
    <PaymentGate feature="Career Roadmap">
      <CareerRoadmapContent />
    </PaymentGate>
  );
}
