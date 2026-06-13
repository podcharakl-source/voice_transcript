import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function transcribeAudio(base64Data: string, mimeType: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured. Please add it in the Secrets panel.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: "Please transcribe this audio exactly as it is spoken. Output only the transcription text.",
            },
          ],
        },
      ],
    });

    const text = response.text;
    if (!text) {
      throw new Error("No transcription was generated.");
    }

    return text;
  } catch (error) {
    console.error("Transcription error:", error);
    if (error instanceof Error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during transcription.");
  }
}
