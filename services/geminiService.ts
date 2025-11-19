
import { GoogleGenAI } from "@google/genai";

export const getFinancialTip = async (): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me a short, actionable financial tip for today. Be creative and encouraging.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching financial tip:", error);
    return "Could not fetch a financial tip at this moment. Try saving more than you spend!";
  }
};
