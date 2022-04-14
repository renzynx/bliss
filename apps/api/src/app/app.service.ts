import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IAppService } from '../lib/interfaces';

@Injectable()
export class AppService implements IAppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getFile(slug: string) {
    return this.cacheManager.get<string>(slug);
  }
}
