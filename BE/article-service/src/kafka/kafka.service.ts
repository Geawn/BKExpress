import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Kafka, Consumer } from "kafkajs";
import { KafkaConfig } from "./kafka.config";
import { ArticlesService } from "../articles/article.service";
import { CreateArticleDto } from "../articles/dto/create-article.dto"; // Nhớ import

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  constructor(
    private readonly kafkaConfig: KafkaConfig,
    private readonly articlesService: ArticlesService,
  ) {
    this.kafka = new Kafka({
      clientId: this.kafkaConfig.clientId,
      brokers: [this.kafkaConfig.bootstrapServers],
    });
    this.consumer = this.kafka.consumer({ groupId: this.kafkaConfig.groupId });
  }

  async onModuleInit() {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: this.kafkaConfig.topic,
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ partition, message }) => {
          if (!message.value) {
            this.logger.warn(
              `Received message with null value from partition ${partition}`,
            );
            return;
          }

          let articleData: unknown;
          try {
            articleData = JSON.parse(message.value.toString());
            this.logger.log(
              `Raw article received: ${JSON.stringify(articleData)}`,
            ); // Log dữ liệu thô
          } catch (err: unknown) {
            const errorMessage =
              err instanceof Error ? err.message : String(err);
            this.logger.error(`Failed to parse JSON: ${errorMessage}`);
            return;
          }

          if (this.isValidArticle(articleData)) {
            const article = articleData;
            this.logger.log(
              `Received article: ${article.title} from partition ${partition}`,
            );
            await this.articlesService.createArticles([article]);
          } else {
            this.logger.warn(
              `Invalid article format: ${JSON.stringify(articleData)}`,
            );
          }
        },
      });

      this.logger.log(
        `Kafka consumer started for topic ${this.kafkaConfig.topic}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error starting Kafka consumer: ${errorMessage}`);
    }
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    this.logger.log("Kafka consumer disconnected");
  }

  private isValidArticle(data: unknown): data is CreateArticleDto {
    return (
      typeof data === "object" &&
      data !== null &&
      "title" in data &&
      typeof (data as Record<string, unknown>).title === "string" &&
      "link" in data &&
      typeof (data as Record<string, unknown>).link === "string" &&
      "pubDate" in data &&
      typeof (data as Record<string, unknown>).pubDate === "string" &&
      "pubDateTZ" in data &&
      typeof (data as Record<string, unknown>).pubDateTZ === "string" &&
      "image_url" in data &&
      typeof (data as Record<string, unknown>).image_url === "string" &&
      "source_id" in data &&
      typeof (data as Record<string, unknown>).source_id === "string" &&
      "source_name" in data &&
      typeof (data as Record<string, unknown>).source_name === "string" &&
      "source_url" in data &&
      typeof (data as Record<string, unknown>).source_url === "string"
    );
  }
}
