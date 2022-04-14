import { Module, CacheModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { DeleteModule } from '../delete/delete.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './app.guard';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      url: `redis://${process.env.REDISUSER}:${process.env.REDISPASSWORD}@${process.env.REDISHOST}:${process.env.REDISPORT}`,
      ttl: 0,
    }),
    AuthModule,
    UploadModule,
    DeleteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
