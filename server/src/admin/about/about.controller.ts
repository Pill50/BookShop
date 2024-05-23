import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Response } from 'express';
import { SessionGuard } from 'src/common/guard/session.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';

@Controller('admin/about')
@Roles(Role.ADMIN)
@UseGuards(SessionGuard)
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
  async saveAboutPage(@Body() body, @Req() req: any) {
    const { templateHTML } = body;
    const filePath = path.join(process.cwd(), 'public', 'about.html');

    try {
      await fs.writeFile(filePath, templateHTML);
      req.session.success_msg = 'Update about content successfully';
    } catch (err) {
      req.session.error_msg = err.message;
    }
  }
}
