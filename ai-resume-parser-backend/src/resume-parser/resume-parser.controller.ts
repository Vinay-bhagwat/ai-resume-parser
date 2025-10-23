import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';

@Controller('resume-parser')
export class ResumeParserController {
  private readonly logger = new Logger(ResumeParserController.name);

  constructor(private readonly resumeParserService: ResumeParserService) {}

  @Post('parse')
  async parseText(@Body('text') text: string) {
    try {
      if (!text || text.trim().length === 0) {
        throw new HttpException('Resume text is required', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Processing resume with length: ${text.length} characters`);
      const result = await this.resumeParserService.parseResumeText(text);
      
      if (!result) {
        throw new HttpException('Failed to parse resume', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error parsing resume: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Error processing resume',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
