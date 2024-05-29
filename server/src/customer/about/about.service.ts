import { Injectable } from '@nestjs/common';
import { exceptionHandler } from 'src/common/errors';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class AboutService {
  async getAboutPageContent(): Promise<string> {
    try {
      const filePath = path.join(process.cwd(), 'public', 'about.html');

      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
