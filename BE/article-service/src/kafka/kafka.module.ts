import { Module } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { KafkaConfig } from "./kafka.config";
import { ArticleModule } from "../articles/article.module";

@Module({
  imports: [ArticleModule], // Import ArticlesModule để KafkaService dùng ArticlesService
  providers: [KafkaService, KafkaConfig],
  exports: [KafkaService],
})
export class KafkaModule {}
