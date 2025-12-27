import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { REGIONS, PORTS, INITIAL_PROFILE } from '../constants';
import { ArrowRight, Check, Package, MapPin, Anchor, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface OnboardingProps {
  onComplete: (profile: BusinessProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<BusinessProfile>(INITIAL_PROFILE);

  const updateProfile = (key: keyof BusinessProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'sourceRegions' | 'entryPorts' | 'alertCategories', item: string) => {
    setProfile(prev => {
      const list = prev[key] as string[];
      if (list.includes(item)) {
        return { ...prev, [key]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [key]: [...list, item] };
      }
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Step {step} of 5</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              {step === 1 && "What describes your business?"}
              {step === 2 && "What do you sell?"}
              {step === 3 && "Where do you source from?"}
              {step === 4 && "Any critical dependencies?"}
              {step === 5 && "Set your risk tolerance"}
            </h2>
          </div>

          {/* Step 1: Business Type */}
          {step === 1 && (
            <div className="space-y-3">
              {[
                { id: 'product_seller', label: 'Product Seller', icon: Package, desc: 'E-commerce, FBA, Retail' },
                { id: 'manufacturing', label: 'Manufacturing', icon: Anchor, desc: 'Assembly, Fabrication' },
                { id: 'food_beverage', label: 'Food & Beverage', icon: Check, desc: 'Restaurants, Cafes' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => updateProfile('businessType', type.id)}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 hover:bg-slate-50",
                    profile.businessType === type.id ? "border-blue-600 bg-blue-50/50" : "border-slate-200"
                  )}
                >
                  <div className={clsx("p-2 rounded-lg", profile.businessType === type.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500")}>
                    <type.icon size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{type.label}</div>
                    <div className="text-sm text-slate-500">{type.desc}</div>
                  </div>
                  {profile.businessType === type.id && <Check className="ml-auto text-blue-600" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Products */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Describe your products</label>
              <textarea
                value={profile.productsDescription}
                onChange={(e) => updateProfile('productsDescription', e.target.value)}
                placeholder="e.g. Phone cases, specialty coffee beans, custom t-shirts..."
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-slate-500">The AI uses this to match alerts to your inventory type.</p>
            </div>
          )}

          {/* Step 3: Regions & Ports */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <MapPin size={16} /> Sourcing Regions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => toggleArrayItem('sourceRegions', region)}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm border text-left transition-colors",
                        profile.sourceRegions.includes(region) 
                          ? "bg-blue-600 border-blue-600 text-white shadow-md" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Anchor size={16} /> Key Entry Ports
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PORTS.map(port => (
                    <button
                      key={port}
                      onClick={() => toggleArrayItem('entryPorts', port)}
                      className={clsx(
                        "px-3 py-2 rounded-lg text-sm border text-left transition-colors",
                        profile.entryPorts.includes(port) 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {port}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Critical Dependencies */}
          {step === 4 && (
            <div className="space-y-4">
               <label className="block text-sm font-medium text-slate-700">Critical Suppliers or Materials (Optional)</label>
              <textarea
                value={profile.criticalDependencies}
                onChange={(e) => updateProfile('criticalDependencies', e.target.value)}
                placeholder="e.g. TSMC chips, Ethiopian Yirgacheffe beans, Lithium batteries..."
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-slate-500">We'll flag any event that mentions these keywords with high urgency.</p>
            </div>
          )}

           {/* Step 5: Risk Tolerance */}
           {step === 5 && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'sensitive', label: 'Very Sensitive', desc: 'Perishables, Just-in-Time (Alert me on everything)' },
                    { id: 'moderate', label: 'Moderate', desc: '2-4 week buffer stock (Standard)' },
                    { id: 'resilient', label: 'Resilient', desc: 'Months of inventory (Only critical disasters)' },
                  ].map(level => (
                    <button
                      key={level.id}
                      onClick={() => updateProfile('riskTolerance', level.id)}
                      className={clsx(
                        "text-left p-4 rounded-xl border-2 transition-all hover:bg-slate-50",
                        profile.riskTolerance === level.id ? "border-blue-600 bg-blue-50" : "border-slate-200"
                      )}
                    >
                      <div className="font-semibold text-slate-900">{level.label}</div>
                      <div className="text-sm text-slate-500">{level.desc}</div>
                    </button>
                  ))}
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldAlert size={16}/> Monitored Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Disasters', 'Port Disruptions', 'Geopolitical', 'Recalls', 'Trade Policy'].map(cat => (
                      <span key={cat} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-10 flex justify-between items-center">
             {step > 1 ? (
               <button onClick={prevStep} className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2">
                 Back
               </button>
             ) : (
               <div></div>
             )}
             
             <button
              onClick={() => {
                if (step < 5) nextStep();
                else onComplete(profile);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-transform active:scale-95"
             >
               {step === 5 ? 'Create Profile' : 'Continue'}
               <ArrowRight size={18} />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
