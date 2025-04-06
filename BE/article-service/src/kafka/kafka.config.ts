import { Injectable } from "@nestjs/common";

@Injectable()
export class KafkaConfig {
  readonly bootstrapServers: string =
    process.env.KAFKA_BOOTSTRAP_SERVERS || "localhost:9092";
  readonly topic: string = process.env.KAFKA_TOPIC || "articles_topic";
  readonly clientId: string = "articles-server";
  readonly groupId: string = "articles-group";
}
