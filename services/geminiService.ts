import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, AnalysisResult, RawNewsItem } from "../types";

// Note: In a real app, API key should be in process.env and calls should be proxied through backend.
// For this demo, we assume the key is available or we provide a simulated response if not.

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeAlertWithGemini = async (
  profile: BusinessProfile,
  newsItem: RawNewsItem
): Promise<AnalysisResult> => {
  const ai = getAiClient();

  if (!ai) {
    console.warn("No API Key found. Returning mock analysis.");
    return mockAnalysis(profile, newsItem);
  }

  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
You are a Supply Chain Risk Analyst for small businesses. Your job is to analyze global alerts and determine if they affect a specific business's supply chain.

INPUTS:
1. ALERT: A news item or warning about a global event
2. BUSINESS PROFILE: A description of the user's business, sourcing regions, and dependencies

TASK:
1. Identify what the alert is about (disaster, port issue, trade policy, recall, etc.)
2. Identify the geographic regions and industries affected
3. Compare against the business profile
4. Determine relevance and urgency

RULES:
- Be conservative with "critical" urgency — reserve for genuine emergencies
- If the alert region doesn't overlap with user's supply chain, relevant=false
- Consider second-order effects (e.g. Taiwan chip shortage -> phone case electronics)
- If uncertain, set confidence="low" and explain in reasoning
- Never invent supply chain connections that aren't plausible
`;

  const userPrompt = `
--- GLOBAL ALERT ---
Source: ${newsItem.source}
Type: ${newsItem.type}
Date: ${newsItem.date}
Location: ${newsItem.location}
Title: ${newsItem.title}
Summary: ${newsItem.summary}

--- BUSINESS PROFILE ---
Business Type: ${profile.businessType}
Products: ${profile.productsDescription}
Sourcing Regions: ${profile.sourceRegions.join(', ')}
Entry Ports: ${profile.entryPorts.join(', ')}
Critical Dependencies: ${profile.criticalDependencies}
Risk Tolerance: ${profile.riskTolerance}

--- ANALYSIS REQUEST ---
Determine if this alert affects this business's supply chain. 
Return JSON matching the schema.
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                relevant: { type: Type.BOOLEAN },
                confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
                urgency: { type: Type.STRING, enum: ["critical", "high", "medium", "low"], nullable: true },
                impact_type: { type: Type.STRING, enum: ['supply_disruption', 'shipping_delay', 'cost_increase', 'safety_recall', 'regulatory'], nullable: true },
                affected_aspect: { type: Type.STRING, nullable: true },
                reasoning: { type: Type.STRING },
                recommended_action: { type: Type.STRING, nullable: true },
                estimated_timeline: { type: Type.STRING, nullable: true }
            },
            required: ["relevant", "confidence", "reasoning"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return mockAnalysis(profile, newsItem);
  }
};

// Fallback logic for demo purposes if no API key is present
const mockAnalysis = (profile: BusinessProfile, news: RawNewsItem): AnalysisResult => {
  const profileString = JSON.stringify(profile).toLowerCase();
  const newsString = (news.location + ' ' + news.title + ' ' + news.summary).toLowerCase();
  
  // Very naive keyword matching for fallback
  const locationMatch = profile.sourceRegions.some(r => newsString.includes(r.toLowerCase()));
  const portMatch = profile.entryPorts.some(p => newsString.includes(p.toLowerCase()));
  
  const relevant = locationMatch || portMatch;

  return {
    relevant,
    confidence: 'low',
    urgency: relevant ? 'medium' : null,
    impact_type: relevant ? 'supply_disruption' : null,
    affected_aspect: relevant ? 'Sourcing Region Match' : null,
    reasoning: relevant 
      ? `Simulated: The alert location matches your sourcing region or port.` 
      : `Simulated: No direct geographic overlap found with your profile.`,
    recommended_action: relevant ? 'Monitor situation.' : null,
    estimated_timeline: null
  };
};
