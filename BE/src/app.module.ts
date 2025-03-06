import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticleModule } from "./articles/article.module";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URL || "mongodb://localhost:27017/news",
    ),
    ArticleModule,
    AuthModule,
    RedisModule,
  ],
})
export class AppModule {}
