import { Injectable } from '@nestjs/common';
import { IAppService } from '../lib/interfaces';
import { FileCache } from '../main';

@Injectable()
export class AppService implements IAppService {
  getFile(slug: string) {
    return FileCache.get(slug);
  }
}
