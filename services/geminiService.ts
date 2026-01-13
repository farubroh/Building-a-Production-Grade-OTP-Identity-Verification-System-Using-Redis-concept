
import { GoogleGenAI } from "@google/genai";
import { AuditLogEntry } from "../types";

export const analyzeSecurityLogs = async (logs: AuditLogEntry[]) => {
  // Always initialize a new GoogleGenAI instance inside the function to use the latest API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format logs for context
  const logContext = logs.slice(0, 20).map(l => ({
    time: l.timestamp,
    user: l.identifier,
    status: l.status,
    purpose: l.purpose
  }));

  const prompt = `
    As a Senior Security Engineer, analyze these recent OTP verification audit logs and provide a summary of potential threats or system health.
    
    Recent Logs:
    ${JSON.stringify(logContext, null, 2)}
    
    Provide your response in clear sections:
    1. System Health Status
    2. Potential Anomalies (e.g., brute force signs, high failure rates)
    3. Actionable Security Recommendations
    
    Keep it professional and concise.
  `;

  try {
    // Upgrading to gemini-3-pro-preview for complex text tasks requiring advanced reasoning.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Correctly accessing the .text property from the GenerateContentResponse object.
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to perform security analysis at this time.";
  }
};
