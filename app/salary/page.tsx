'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  JobOffer,
  CompensationBreakdown,
  NegotiationScript,
  NegotiationLeverage,
  MarketData,
  ExperienceLevel,
  Location,
  EXPERIENCE_LEVELS,
  LOCATIONS,
} from './types';
import {
  calculateCompensationBreakdown,
  compareOffers,
  formatCurrency,
  formatLargeNumber,
  calculateTakeHomePay,
  projectEquityValue,
} from './compensationCalculator';
import {
  getMarketData,
  compareToMarket,
  analyzeNegotiationLeverage,
} from './marketData';
import PaymentGate from '../components/PaymentGate';
import {
  NEGOTIATION_SCRIPTS,
  getRecommendedScripts,
  getScriptsByDifficulty,
} from './negotiationScripts';

function SalaryNegotiationContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<'market' | 'calculator' | 'scripts' | 'compare'>('market');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  // Market research form
  const [marketForm, setMarketForm] = useState({
    role: 'Software Engineer',
    level: 'Mid Level (3-5 years)',
    location: 'San Francisco Bay Area',
  });

  // Offer input form
  const [currentOffer, setCurrentOffer] = useState<Partial<JobOffer>>({
    company: '',
    role: '',
    location: '',
    level: '',
    baseSalary: 0,
    signingBonus: 0,
    performanceBonus: 0,
    equityValue: 0,
    vestingSchedule: '4 years, 25% per year',
  });

  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [selectedScripts, setSelectedScripts] = useState<NegotiationScript[]>([]);
  const [negotiationLeverage, setNegotiationLeverage] = useState<NegotiationLeverage | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Load market data
  const handleLoadMarketData = async () => {
    setIsLoadingMarket(true);
    try {
      const data = await getMarketData(
        marketForm.role,
        marketForm.level as ExperienceLevel,
        marketForm.location as Location
      );
      setMarketData(data);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Calculate offer comparison
  const handleAnalyzeOffer = () => {
    if (!currentOffer.baseSalary || !marketData) return;

    const totalComp =
      (currentOffer.baseSalary || 0) +
      (currentOffer.signingBonus || 0) +
      (currentOffer.performanceBonus || 0) +
      (currentOffer.equityValue || 0);

    const comparison = compareToMarket(
      currentOffer.baseSalary,
      totalComp,
      marketData
    );

    const leverage = analyzeNegotiationLeverage(
      currentOffer.baseSalary,
      totalComp,
      marketData,
      offers.length > 1,
      0
    );

    setNegotiationLeverage(leverage);

    // Get recommended scripts
    const recommended = getRecommendedScripts({
      hasCompetingOffers: offers.length > 1,
      offerBelowMarket: comparison.marketPosition === 'below',
      wantsRemoteWork: false,
      needsRelocation: false,
      isStartup: currentOffer.vestingSchedule?.includes('4 years') || false,
    });

    setSelectedScripts(recommended);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Salary Negotiation Hub
                </h1>
                <p className="text-sm text-gray-500">Market data • Compensation calculator • Negotiation scripts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">Professional Plan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Value Proposition Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-1">Average Salary Increase from Negotiation: $15,000+</h3>
              <p className="text-sm text-green-700 mb-3">
                Studies show that 84% of employers expect candidates to negotiate, yet 68% of people accept the first offer.
                Don&apos;t leave money on the table - use our data-driven tools to negotiate confidently.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">$50K+</div>
                  <div className="text-xs text-gray-600">Average lifetime earnings increase from one successful negotiation</div>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">10-20%</div>
                  <div className="text-xs text-gray-600">Typical increase achievable with market data</div>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">84%</div>
                  <div className="text-xs text-gray-600">Of employers expect you to negotiate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex gap-1">
          {[
            { id: 'market', label: 'Market Research', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'calculator', label: 'Compensation Calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
            { id: 'scripts', label: 'Negotiation Scripts', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
            { id: 'compare', label: 'Compare Offers', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'market' | 'calculator' | 'scripts' | 'compare')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {/* Market Research Tab */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Market Salary Data
                </h2>

                {/* Market Research Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={marketForm.role}
                      onChange={(e) => setMarketForm({ ...marketForm, role: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={marketForm.level}
                      onChange={(e) => setMarketForm({ ...marketForm, level: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <select
                      value={marketForm.location}
                      onChange={(e) => setMarketForm({ ...marketForm, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    >
                      {LOCATIONS.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleLoadMarketData}
                  disabled={isLoadingMarket}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoadingMarket ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading Market Data...
                    </span>
                  ) : (
                    'Get Market Data'
                  )}
                </button>

                {/* Market Data Display */}
                {marketData && (
                  <div className="mt-8 space-y-6 animate-fadeIn">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {marketData.role} • {marketData.level} • {marketData.location}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Based on {marketData.sampleSize.toLocaleString()} data points •
                        Last updated {marketData.lastUpdated.toLocaleDateString()}
                      </p>

                      {/* Base Salary */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">💵 Base Salary</h4>
                        <div className="grid grid-cols-5 gap-3">
                          {[
                            { label: 'Min', value: marketData.baseSalary.min },
                            { label: '25th %', value: marketData.baseSalary.p25 },
                            { label: 'Median', value: marketData.baseSalary.median, highlight: true },
                            { label: '75th %', value: marketData.baseSalary.p75 },
                            { label: 'Max', value: marketData.baseSalary.max },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className={`p-3 rounded-lg text-center ${
                                item.highlight
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                  : 'bg-white'
                              }`}
                            >
                              <div className={`text-xs font-medium mb-1 ${item.highlight ? 'text-blue-100' : 'text-gray-500'}`}>
                                {item.label}
                              </div>
                              <div className={`text-lg font-bold ${item.highlight ? 'text-white' : 'text-gray-900'}`}>
                                {formatLargeNumber(item.value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Compensation */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Total Compensation</h4>
                        <div className="grid grid-cols-5 gap-3">
                          {[
                            { label: 'Min', value: marketData.totalComp.min },
                            { label: '25th %', value: marketData.totalComp.p25 },
                            { label: 'Median', value: marketData.totalComp.median, highlight: true },
                            { label: '75th %', value: marketData.totalComp.p75 },
                            { label: 'Max', value: marketData.totalComp.max },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className={`p-3 rounded-lg text-center ${
                                item.highlight
                                  ? 'bg-green-600 text-white ring-2 ring-green-400'
                                  : 'bg-white'
                              }`}
                            >
                              <div className={`text-xs font-medium mb-1 ${item.highlight ? 'text-green-100' : 'text-gray-500'}`}>
                                {item.label}
                              </div>
                              <div className={`text-lg font-bold ${item.highlight ? 'text-white' : 'text-gray-900'}`}>
                                {formatLargeNumber(item.value)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-white rounded-xl border-2 border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Equity Range</h4>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatLargeNumber(marketData.equity.median)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Range: {formatLargeNumber(marketData.equity.min)} - {formatLargeNumber(marketData.equity.max)}
                        </div>
                      </div>

                      <div className="p-5 bg-white rounded-xl border-2 border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Bonus Range</h4>
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {formatLargeNumber(marketData.bonus.median)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Range: {formatLargeNumber(marketData.bonus.min)} - {formatLargeNumber(marketData.bonus.max)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compensation Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🧮</span>
                Total Compensation Calculator
              </h2>

              <p className="text-sm text-gray-600 mb-8">
                Calculate your true 4-year total compensation including salary, bonuses, equity, and benefits.
              </p>

              {/* Offer Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={currentOffer.company}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="e.g., Google"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    value={currentOffer.role}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Base Salary</label>
                  <input
                    type="number"
                    value={currentOffer.baseSalary}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, baseSalary: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="180000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Signing Bonus</label>
                  <input
                    type="number"
                    value={currentOffer.signingBonus}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, signingBonus: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Performance Bonus</label>
                  <input
                    type="number"
                    value={currentOffer.performanceBonus}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, performanceBonus: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="20000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Equity Value (4 years)</label>
                  <input
                    type="number"
                    value={currentOffer.equityValue}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, equityValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                    placeholder="200000"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyzeOffer}
                disabled={!currentOffer.baseSalary || !marketData}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-8"
              >
                🔬 Analyze Offer vs Market
              </button>

              {!marketData && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <strong>Tip:</strong> Load market data first from the &quot;Market Research&quot; tab to compare your offer against industry standards.
                  </p>
                </div>
              )}

              {/* Leverage Analysis */}
              {negotiationLeverage && marketData && (
                <div className="mt-8 space-y-6 animate-fadeIn">
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Negotiation Strategy</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-white rounded-lg p-5">
                        <div className="text-sm font-medium text-gray-600 mb-1">Confidence Score</div>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {negotiationLeverage.confidenceScore}/100
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${negotiationLeverage.confidenceScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-5">
                        <div className="text-sm font-medium text-gray-600 mb-1">Recommended Strategy</div>
                        <div className="text-3xl font-bold text-purple-600 mb-2 capitalize">
                          {negotiationLeverage.strategy}
                        </div>
                        <div className="text-xs text-gray-500">
                          {negotiationLeverage.strategy === 'aggressive' && 'Push hard, you have strong leverage'}
                          {negotiationLeverage.strategy === 'moderate' && 'Negotiate firmly but fairly'}
                          {negotiationLeverage.strategy === 'conservative' && 'Negotiate carefully, build your case'}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-5">
                        <div className="text-sm font-medium text-gray-600 mb-1">Target Increase</div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatLargeNumber(negotiationLeverage.targetIncrease)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Bring you to 60th percentile
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-3">Your Strengths</h4>
                        <ul className="space-y-2">
                          {negotiationLeverage.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">●</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3">Considerations</h4>
                        <ul className="space-y-2">
                          {negotiationLeverage.weaknesses.map((weakness: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">●</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Talking Points */}
                    <div className="mt-6 p-5 bg-white rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Talking Points</h4>
                      <ul className="space-y-2">
                        {negotiationLeverage.talkingPoints.map((point: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 pl-4 border-l-2 border-blue-500">
                            &quot;{point}&quot;
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Negotiation Scripts Tab */}
          {activeTab === 'scripts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-3xl">💬</span>
                  Negotiation Scripts Library
                </h2>

                <p className="text-sm text-gray-600 mb-8">
                  Professional, proven negotiation scripts for every scenario. Copy, customize, and use with confidence.
                </p>

                {/* Recommended Scripts */}
                {selectedScripts.length > 0 && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for Your Situation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedScripts.map((script) => (
                        <div key={script.id} className="p-4 bg-white rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-1">{script.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{script.whenToUse}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            script.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            script.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {script.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Scripts */}
                <div className="space-y-6">
                  {NEGOTIATION_SCRIPTS.map((script) => (
                    <div key={script.id} className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{script.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{script.whenToUse}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                              script.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              script.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {script.difficulty}
                            </span>
                            {script.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Script Content */}
                      <div className="p-5 bg-white rounded-lg border border-gray-300 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Script Template</h4>
                        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-mono">
                          {script.script}
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3">Tips</h4>
                        <ul className="space-y-2">
                          {script.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compare Offers Tab */}
          {activeTab === 'compare' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">⚖️</span>
                Compare Multiple Offers
              </h2>

              <p className="text-sm text-gray-600 mb-8">
                Coming soon: Side-by-side comparison of multiple job offers with detailed breakdowns and recommendations.
              </p>

              <div className="p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Feature In Development</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We&apos;re building an advanced offer comparison tool that will help you evaluate multiple offers side-by-side with total comp breakdowns, benefits scoring, and AI-powered recommendations.
                </p>
                <button className="px-6 py-3 bg-gray-300 text-gray-600 rounded-xl font-semibold cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SalaryNegotiationPage() {
  return (
    <PaymentGate feature="Salary Negotiation Hub">
      <SalaryNegotiationContent />
    </PaymentGate>
  );
}
