import React, { useState, useEffect } from 'react';
import { ViewState, BusinessProfile, Alert } from './types';
import { MOCK_ALERTS, INITIAL_PROFILE } from './constants';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import AlertDetail from './components/AlertDetail';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [profile, setProfile] = useState<BusinessProfile>(INITIAL_PROFILE);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    // Load mock alerts initially
    // In a real app, we'd fetch these from backend
    setAlerts(MOCK_ALERTS);
  }, []);

  const handleProfileComplete = (newProfile: BusinessProfile) => {
    setProfile(newProfile);
    // In a real app, save profile to DB here
    setView('dashboard');
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setView('alert-detail');
  };

  const handleAddAlert = (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
  };

  const handleDismissAlert = (id: string) => {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'dismissed' as const } : a));
  };

  const renderView = () => {
    switch (view) {
      case 'onboarding':
        return <Onboarding onComplete={handleProfileComplete} />;
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            alerts={alerts} 
            onAlertClick={handleAlertClick} 
            onAddAlert={handleAddAlert}
          />
        );
      case 'alert-detail':
        return selectedAlert ? (
          <AlertDetail 
            alert={selectedAlert} 
            onBack={() => setView('dashboard')} 
            onDismiss={handleDismissAlert}
          />
        ) : (
          <Dashboard 
            profile={profile} 
            alerts={alerts} 
            onAlertClick={handleAlertClick}
            onAddAlert={handleAddAlert}
          />
        );
      default:
        return <Onboarding onComplete={handleProfileComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Navigation Bar (only show after onboarding) */}
        {view !== 'onboarding' && (
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div 
                        className="flex items-center gap-2 font-bold text-lg text-slate-900 cursor-pointer"
                        onClick={() => setView('dashboard')}
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            S
                        </div>
                        Supply Chain Guardian
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Settings</button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                            {profile.businessType[0].toUpperCase()}
                        </div>
                    </div>
                </div>
            </nav>
        )}
        
        <main>
            {renderView()}
        </main>
    </div>
  );
};

export default App;
