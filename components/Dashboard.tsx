import React, { useState } from 'react';
import { Alert, BusinessProfile, RawNewsItem } from '../types';
import { analyzeAlertWithGemini } from '../services/geminiService';
import { Bell, Map, Activity, ShieldCheck, ChevronRight, X, AlertTriangle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import RiskMap from './RiskMap';
import { MOCK_NEWS_FEED } from '../constants';

interface DashboardProps {
  profile: BusinessProfile;
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onAddAlert: (alert: Alert) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, alerts, onAlertClick, onAddAlert }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<string>('');

  const criticalCount = alerts.filter(a => a.status === 'unread' && a.analysis.urgency === 'critical').length;
  const warningCount = alerts.filter(a => a.status === 'unread' && (a.analysis.urgency === 'high' || a.analysis.urgency === 'medium')).length;

  const simulateNewEvent = async () => {
    setIsSimulating(true);
    setSimulationStep('Fetching global news streams...');
    
    // 1. Pick a random news item
    await new Promise(r => setTimeout(r, 1500));
    const randomNews = MOCK_NEWS_FEED[Math.floor(Math.random() * MOCK_NEWS_FEED.length)];
    
    setSimulationStep(`Analyzing event: "${randomNews.title}"...`);
    
    // 2. Call Gemini
    const analysis = await analyzeAlertWithGemini(profile, randomNews);
    
    setSimulationStep('Finalizing risk assessment...');
    await new Promise(r => setTimeout(r, 800));

    // 3. Add to list
    const newAlert: Alert = {
        id: Date.now().toString(),
        title: randomNews.title,
        source: randomNews.source,
        date: randomNews.date,
        location: randomNews.location,
        summary: randomNews.summary,
        status: 'unread',
        analysis: analysis
    };

    onAddAlert(newAlert);
    setIsSimulating(false);
    setSimulationStep('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Supply Chain Guardian</h1>
          <p className="text-slate-500">Monitoring risks for <span className="font-medium text-slate-700">{profile.productsDescription || 'your business'}</span></p>
        </div>
        <button 
          onClick={simulateNewEvent}
          disabled={isSimulating}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all disabled:opacity-70"
        >
          {isSimulating ? <Loader2 className="animate-spin" size={18} /> : <Activity size={18} />}
          {isSimulating ? 'Analyzing...' : 'Simulate Global Event'}
        </button>
      </div>

      {/* Simulation Banner */}
      {isSimulating && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
            <Loader2 className="animate-spin" size={20}/>
            <span className="font-medium">{simulationStep}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Risk Status</p>
            <h3 className={clsx("text-2xl font-bold", criticalCount > 0 ? "text-red-600" : "text-emerald-600")}>
              {criticalCount > 0 ? 'CRITICAL' : 'STABLE'}
            </h3>
            <p className="text-xs text-slate-400 mt-2">Last checked: Just now</p>
          </div>
          <div className={clsx("p-3 rounded-full", criticalCount > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Threats</p>
            <h3 className="text-2xl font-bold text-slate-900">{criticalCount} Critical</h3>
            <p className="text-xs text-slate-400 mt-2">{warningCount} warnings to monitor</p>
          </div>
          <div className="p-3 rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Monitored Regions</p>
            <h3 className="text-2xl font-bold text-slate-900">{profile.sourceRegions.length} Regions</h3>
            <p className="text-xs text-slate-400 mt-2">{profile.entryPorts.length} Entry Ports tracked</p>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Map size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <Bell size={20} className="text-slate-500"/> Intelligence Feed
             </h2>
             <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{alerts.length}</span>
          </div>

          <div className="space-y-3">
             {alerts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No active alerts.</p>
                    <p className="text-xs text-slate-400">Click "Simulate Global Event" to test.</p>
                </div>
             ) : (
                 alerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => onAlertClick(alert)}
                      className={clsx(
                        "bg-white p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md relative overflow-hidden group",
                        alert.analysis.relevant ? "border-slate-200" : "border-slate-100 opacity-60 bg-slate-50"
                      )}
                    >
                      {/* Urgency Stripe */}
                      {alert.analysis.relevant && (
                        <div className={clsx(
                            "absolute left-0 top-0 bottom-0 w-1",
                            alert.analysis.urgency === 'critical' ? 'bg-red-500' : 
                            alert.analysis.urgency === 'high' ? 'bg-orange-500' : 
                            alert.analysis.urgency === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                        )} />
                      )}

                      <div className="pl-3">
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{alert.source}</span>
                              <span className="text-xs text-slate-400">{new Date(alert.date).toLocaleDateString()}</span>
                          </div>
                          <h3 className="font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">{alert.title}</h3>
                          
                          {alert.analysis.relevant ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className={clsx("text-xs px-2 py-0.5 rounded font-medium", 
                                     alert.analysis.urgency === 'critical' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                                     {alert.analysis.urgency?.toUpperCase()} IMPACT
                                </span>
                                {alert.analysis.impact_type && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium capitalize">
                                        {alert.analysis.impact_type.replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                          ) : (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-400 font-medium">Irrelevant</span>
                          )}
                      </div>
                      
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                 ))
             )}
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Map size={20} className="text-slate-500"/> Global Risk Map
                </h2>
             </div>
             <RiskMap alerts={alerts.filter(a => a.analysis.relevant)} userRegions={profile.sourceRegions} />

             {/* Recent Context Section */}
             <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
                <h3 className="font-semibold text-slate-900 mb-4">Why AI matters for your supply chain</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-medium text-slate-900 mb-1">Noise Reduction</div>
                        <p className="text-sm text-slate-500">Traditional tools alert you on every typhoon. We only alert you if it hits <strong>Shenzhen</strong> or your specific ports.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-medium text-slate-900 mb-1">Second-Order Effects</div>
                        <p className="text-sm text-slate-500">We understand that a <strong>chip shortage in Taiwan</strong> affects your ability to source phone cases, even if you don't buy chips directly.</p>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
