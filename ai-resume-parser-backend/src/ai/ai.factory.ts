import { IAIProvider } from './ai.interface';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';

export class AIProviderFactory {
  static create(providerName: string, apiKey: string, model: string): IAIProvider {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider(apiKey, model);
      case 'gemini':
        return new GeminiProvider(apiKey, model);
      default:
        throw new Error(`Unsupported AI provider: ${providerName}`);
    }
  }
}
