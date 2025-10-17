import OpenAI from "openai";
import { IAIProvider } from "../ai.interface";
import { queryPrompt } from "../constant/query";
import { Logger } from "@nestjs/common";

export class OpenAIProvider implements IAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async parseResumeText(text: string): Promise<any> {
    const prompt = `
    ${queryPrompt}
    ${text}
        `;

    const res = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
    });

    const output = res.choices[0].message?.content || "{}";
    return JSON.parse(output);
  }
}
