import { IAIProvider } from "../ai.interface";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { queryPrompt } from "../constant/query";

export class GeminiProvider implements IAIProvider {
  private model;

  constructor(apiKey: string, model: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: model });
  }

  async parseResumeText(text: string): Promise<any> {
    const prompt = `
     ${queryPrompt}
      ${text}
    `;
    const result = await this.model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}
