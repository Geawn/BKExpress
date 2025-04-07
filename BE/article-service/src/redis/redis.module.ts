import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      url: process.env.CACHE_URL,
      ttl: 300,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
