import { Injectable, Logger } from '@nestjs/common';
import { AIProviderFactory } from '../ai/ai.factory';

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);
  private aiProvider: any;

  constructor() {
    const provider = process.env.AI_PROVIDER || 'openai';
    const apiKey = process.env.AI_API_KEY || '';
    const model = process.env.AI_MODEL || 'gpt-4';

    this.logger.log(`Using AI Provider: ${provider}, Model: ${model}, API Key: ${apiKey ? '****' + apiKey.slice(-4) : 'Not Provided'}`);

    this.aiProvider = AIProviderFactory.create(provider, apiKey, model);
  }

  async parseResumeText(text: string) {
    return await this.aiProvider.parseResumeText(text);
  }
}
