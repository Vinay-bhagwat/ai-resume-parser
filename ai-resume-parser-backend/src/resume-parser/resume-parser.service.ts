import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import  pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import OpenAI from 'openai';

@Injectable()
export class ResumeParserService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async parseResume(filePath: string) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      let text = '';

      if (filePath.endsWith('.pdf')) {
        const data = await pdfParse(fileBuffer);
        text = data.text;
      } else if (filePath.endsWith('.docx')) {
        const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
        text = value;
      } else {
        throw new Error('Unsupported file type');
      }

      // 🧠 Construct AI Prompt
      const prompt = `
      Extract the following details from this resume text and return a clean JSON:
      - fullName
      - email
      - phone
      - address
      - skills (as array)
      - education (array of {degree, institution, year})
      - experience (array of {company, role, duration, description})

      Resume Text:
      ${text}
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const raw = response.choices[0].message.content || '';

      try {
        const parsed = JSON.parse(raw);
        return { success: true, data: parsed };
      } catch {
        return { success: false, error: 'Invalid JSON returned by AI', raw };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  }
}
