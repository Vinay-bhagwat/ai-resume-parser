import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ResumeParserService } from './resume-parser.service';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
  @Controller('resume-parser')
  export class ResumeParserController {
    constructor(private readonly resumeParserService: ResumeParserService) {}
  
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            const fileExt = extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${fileExt}`;
            callback(null, fileName);
          },
        }),
      }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      return await this.resumeParserService.parseResume(file.path);
    }
  }
  