declare module 'pdf2text' {
    type PdfToTextCallback = (err: any, data: string[]) => void;
  
    export function PDF2Text(filePath: string, callback: PdfToTextCallback): void;
  }
  