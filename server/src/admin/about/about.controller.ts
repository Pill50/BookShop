import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Response } from 'express';

@Controller('admin/about')
export class AboutController {
  @Get('/')
  async viewAboutPage(@Res() res: Response) {
    const filePath = path.join(process.cwd(), 'public', 'about.html');

    try {
      const content = await fs.readFile(filePath, 'utf8');
      res.send(content);
    } catch (err) {
      console.error('Error reading about.html:', err);
      res.status(500).send('Error loading about page content.');
    }
  }

  @Get('/edit')
  @Render('about/index')
  async editAboutPage() {}

  @Post('/save')
  async saveAboutPage(@Body() body) {
    const { templateHTML } = body;
    const filePath = path.join(process.cwd(), 'public', 'about.html');

    try {
      await fs.writeFile(filePath, templateHTML);
    } catch (err) {
      console.error('Error saving about.html:', err);
    }
  }
}
