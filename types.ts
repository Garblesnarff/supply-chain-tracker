export type Urgency = 'critical' | 'high' | 'medium' | 'low' | null;
export type Confidence = 'high' | 'medium' | 'low';
export type ImpactType = 'supply_disruption' | 'shipping_delay' | 'cost_increase' | 'safety_recall' | 'regulatory' | null;
export type AlertStatus = 'unread' | 'read' | 'dismissed' | 'actioned';

export interface BusinessProfile {
  businessType: string;
  productsDescription: string;
  sourceRegions: string[];
  entryPorts: string[];
  criticalDependencies: string;
  riskTolerance: 'sensitive' | 'moderate' | 'resilient';
  alertCategories: string[];
}

export interface AnalysisResult {
  relevant: boolean;
  confidence: Confidence;
  urgency: Urgency;
  impact_type: ImpactType;
  affected_aspect: string | null;
  reasoning: string;
  recommended_action: string | null;
  estimated_timeline: string | null;
}

export interface Alert {
  id: string;
  title: string;
  source: string;
  date: string;
  location: string;
  summary: string;
  fullText?: string;
  status: AlertStatus;
  analysis: AnalysisResult;
}

export interface RawNewsItem {
  id: string;
  source: string;
  type: string;
  date: string;
  location: string;
  title: string;
  summary: string;
  fullText?: string;
}

export type ViewState = 'onboarding' | 'dashboard' | 'alert-detail' | 'settings';
