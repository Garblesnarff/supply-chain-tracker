import { Alert, RawNewsItem, BusinessProfile } from './types';

export const INITIAL_PROFILE: BusinessProfile = {
  businessType: 'product_seller',
  productsDescription: '',
  sourceRegions: [],
  entryPorts: [],
  criticalDependencies: '',
  riskTolerance: 'moderate',
  alertCategories: ['disasters', 'ports', 'geopolitical']
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    title: 'Port of Oakland Labor Negotiations Stalled',
    source: 'FreightWaves',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    location: 'Oakland, USA',
    summary: 'Labor negotiations between ILWU and PMA at Port of Oakland have stalled after union rejected latest contract proposal.',
    status: 'unread',
    analysis: {
      relevant: true,
      confidence: 'high',
      urgency: 'medium',
      impact_type: 'shipping_delay',
      affected_aspect: 'Import logistics via West Coast',
      reasoning: 'Your profile indicates reliance on the Port of Oakland for entry. Stalled negotiations often lead to slowdowns.',
      recommended_action: 'Check if any shipments are currently in transit. Consider routing urgent orders through LA/Long Beach if possible.',
      estimated_timeline: '1-2 weeks potential delay'
    }
  },
  {
    id: '2',
    title: 'Typhoon approaching Vietnam Coast',
    source: 'GDACS',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    location: 'Vietnam',
    summary: 'Tropical Cyclone 12W expecting landfall in northern Vietnam within 48 hours.',
    status: 'read',
    analysis: {
      relevant: true,
      confidence: 'medium',
      urgency: 'low',
      impact_type: 'supply_disruption',
      affected_aspect: 'Manufacturing in Vietnam',
      reasoning: 'You source from Vietnam. While the storm path is currently north of major industrial zones, it bears watching.',
      recommended_action: 'Monitor storm path. Contact suppliers for status check if path shifts south.',
      estimated_timeline: '3-4 days'
    }
  },
  {
    id: '3',
    title: 'New Export Controls on Semiconductor Materials',
    source: 'Reuters',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    location: 'China',
    summary: 'China announces new restrictions on the export of Gallium and Germanium starting next month.',
    status: 'actioned',
    analysis: {
      relevant: false,
      confidence: 'high',
      urgency: null,
      impact_type: null,
      affected_aspect: null,
      reasoning: 'Your product description (Coffee Beans) does not utilize semiconductor materials.',
      recommended_action: null,
      estimated_timeline: null
    }
  }
];

export const MOCK_NEWS_FEED: RawNewsItem[] = [
  {
    id: 'news-1',
    source: 'USGS',
    type: 'Earthquake',
    date: new Date().toISOString(),
    location: 'Taiwan',
    title: 'Magnitude 6.2 Earthquake strikes Hualien City',
    summary: 'Strong earthquake reported off the east coast of Taiwan. Buildings shaking in Taipei. Tsunami warning issued for local areas.',
  },
  {
    id: 'news-2',
    source: 'Reuters',
    type: 'Trade Policy',
    date: new Date().toISOString(),
    location: 'India',
    title: 'India Imposes 20% Export Duty on Parboiled Rice',
    summary: 'Government moves to maintain domestic stock and control prices. Immediate effect on all non-basmati white rice exports.',
  },
  {
    id: 'news-3',
    source: 'FreightWaves',
    type: 'Port Disruption',
    date: new Date().toISOString(),
    location: 'Panama Canal',
    title: 'Severe Drought Reduces Panama Canal Draft Limits',
    summary: 'Water levels in Gatun Lake hit historic lows. Vessel transit slots reduced by 30% for the next month.',
  },
  {
    id: 'news-4',
    source: 'USDA',
    type: 'Recall',
    date: new Date().toISOString(),
    location: 'USA',
    title: 'Class I Recall: Frozen Organic Strawberries',
    summary: 'Potential Hepatitis A contamination in organic strawberries sourced from Baja California, Mexico.',
  }
];

export const REGIONS = [
  "China (Mainland)",
  "Taiwan",
  "Vietnam",
  "India",
  "Mexico",
  "USA (Domestic)",
  "Europe",
  "Central America",
  "South America"
];

export const PORTS = [
  "Port of Los Angeles",
  "Port of Long Beach",
  "Port of Oakland",
  "Port of New York/New Jersey",
  "Port of Savannah",
  "Port of Seattle/Tacoma"
];
