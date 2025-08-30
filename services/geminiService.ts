
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

// IMPORTANT: Do NOT add a UI for the API key.
// The API key MUST be acquired from the environment variable `process.env.API_KEY`.
// This variable is assumed to be set in the deployment environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this example, we'll throw an error.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generateContent = async (prompt: string, image?: File): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const parts: Part[] = [{ text: prompt }];

    if (image) {
      const imagePart = await fileToGenerativePart(image);
      parts.unshift(imagePart); // Put image first for better analysis
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
    });

    // Directly use the .text property for the most straightforward text extraction
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}. Please check your API key and network connection. Ensure the API_KEY is correctly set in your environment.`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
};
