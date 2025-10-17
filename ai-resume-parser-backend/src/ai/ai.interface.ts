export interface IAIProvider {
    parseResumeText(text: string): Promise<any>;
  }
  