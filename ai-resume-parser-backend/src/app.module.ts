import { Module } from '@nestjs/common';
import { ResumeParserModule } from './resume-parser/resume-parser.module';

@Module({
  imports: [ResumeParserModule],
})
export class AppModule {}
