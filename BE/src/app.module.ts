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
      process.env.DATABASE_URL || "mongodb+srv://nhathuy2903:XKpqK9PlaV7BImPz@cluster0.vreiy66.mongodb.net/Newspaper_App",
    ),
    ArticleModule,
    AuthModule,
    RedisModule,
  ],
})
export class AppModule {}
