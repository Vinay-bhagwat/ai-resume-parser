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
    const prompt = `${queryPrompt}
${text}`;

    try {
      const res = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant that parses resumes and returns only valid JSON. Never include explanations or text outside the JSON." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent output
      });

      const output = res.choices[0].message?.content?.trim() || "{}";
      
      try {
        return JSON.parse(output);
      } catch (e) {
        Logger.error(`Failed to parse OpenAI response as JSON: ${output}`);
        // Return a basic structure if parsing fails
        return {
          error: "Failed to parse resume",
          raw_content: text
        };
      }
    } catch (e) {
      Logger.error(`OpenAI API error: ${e.message}`);
      throw e;
    }
  }
}
