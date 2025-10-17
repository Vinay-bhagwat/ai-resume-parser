import { Controller, Post, Body } from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';


@Controller('resume-parser')
export class ResumeParserController {
  constructor(private readonly resumeParserService: ResumeParserService) {
    this.resumeParserService = new ResumeParserService();
  }

  @Post('parse')
  async parseText(@Body('text') text: string) {
    return this.resumeParserService.parseResumeText(text);
  }
}
