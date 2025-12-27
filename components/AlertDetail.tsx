import React from 'react';
import { Alert } from '../types';
import { ArrowLeft, Share2, CheckCircle, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';

interface AlertDetailProps {
  alert: Alert;
  onBack: () => void;
  onDismiss: (id: string) => void;
}

const AlertDetail: React.FC<AlertDetailProps> = ({ alert, onBack, onDismiss }) => {
  const isRelevant = alert.analysis.relevant;
  const urgency = alert.analysis.urgency;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className={clsx(
            "h-2",
            urgency === 'critical' ? "bg-red-500" : 
            urgency === 'high' ? "bg-orange-500" :
            urgency === 'medium' ? "bg-amber-400" : "bg-slate-300"
        )} />

        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-slate-500 tracking-wider uppercase">{alert.source}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500">{new Date(alert.date).toLocaleString()}</span>
                     </div>
                     <h1 className="text-3xl font-bold text-slate-900 mb-2">{alert.title}</h1>
                     <div className="flex items-center gap-2 text-slate-600">
                        <span className="bg-slate-100 px-2 py-1 rounded text-sm">{alert.location}</span>
                     </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={() => { onDismiss(alert.id); onBack(); }}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Mark as Resolved"
                    >
                        <CheckCircle size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* AI Analysis Box */}
                    <div className={clsx(
                        "p-6 rounded-xl border-l-4",
                        isRelevant ? "bg-blue-50 border-blue-500" : "bg-slate-50 border-slate-300"
                    )}>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                           <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" className="w-5 h-5 grayscale opacity-70" alt="AI" />
                           AI Analysis
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Reasoning</div>
                                <p className="text-slate-800 leading-relaxed">{alert.analysis.reasoning}</p>
                            </div>
                            
                            {alert.analysis.affected_aspect && (
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Impacted Supply Chain Node</div>
                                    <p className="font-medium text-slate-900">{alert.analysis.affected_aspect}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Plan */}
                    {isRelevant && alert.analysis.recommended_action && (
                        <div>
                             <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={20} /> Recommended Action
                             </h3>
                             <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                <p className="text-slate-800">{alert.analysis.recommended_action}</p>
                                {alert.analysis.estimated_timeline && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600">
                                        <Info size={16} /> Estimated Impact Duration: <span className="font-semibold text-slate-900">{alert.analysis.estimated_timeline}</span>
                                    </div>
                                )}
                             </div>
                        </div>
                    )}

                    {/* Raw Alert Text */}
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Original Source Summary</h3>
                        <p className="text-slate-600 italic leading-relaxed">"{alert.summary}"</p>
                        <a href="#" className="inline-flex items-center gap-1 text-blue-600 text-sm mt-2 hover:underline">
                            Read full report <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Risk Profile</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Relevance</span>
                                    <span className="font-medium text-slate-900">{isRelevant ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div 
                                        className={clsx("h-1.5 rounded-full", isRelevant ? "bg-blue-600" : "bg-slate-400")} 
                                        style={{ width: isRelevant ? '100%' : '0%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Confidence</span>
                                    <span className="font-medium text-slate-900 capitalize">{alert.analysis.confidence}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div 
                                        className="bg-emerald-500 h-1.5 rounded-full" 
                                        style={{ width: alert.analysis.confidence === 'high' ? '90%' : '50%' }}
                                    ></div>
                                </div>
                            </div>

                            {alert.analysis.urgency && (
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Urgency</span>
                                        <span className={clsx(
                                            "font-medium capitalize",
                                            urgency === 'critical' ? 'text-red-600' : 'text-amber-600'
                                        )}>{urgency}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 text-indigo-900">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} /> Business Impact
                        </h3>
                        <p className="text-sm opacity-90">
                           Based on your profile, this event specifically threatens your <strong>{alert.analysis.affected_aspect || "supply chain"}</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;
