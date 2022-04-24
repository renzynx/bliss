import { Controller, Get, Param } from '@nestjs/common';
import { ROUTES } from '../lib/constants';
import { ViewService } from './view.service';

@Controller(ROUTES.VIEW)
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get(':slug')
  getFile(@Param() { slug }: { slug: string }) {
    return this.viewService.getFile(slug);
  }

  @Get(':slug/oembed')
  oEmbed(@Param() { slug }: { slug: string }) {
    return this.viewService.getOembed(slug);
  }
}
