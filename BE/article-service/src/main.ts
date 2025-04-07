import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { Injectable } from "@nestjs/common";

@Injectable()
class NewsService {
  handleCrawlerData(data: any) {
    const sourceIcon = data.sourceIcon;

    if (sourceIcon === 0) {
      console.log("Nhận từ nguồn báo: Tuổi Trẻ");
    } else if (sourceIcon === 1) {
      console.log("Nhận từ nguồn báo: VNExpress");
    } else {
      console.log("Nguồn báo không xác định");
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Tăng giới hạn payload lên 1MB (hoặc cao hơn nếu cần)
  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API documentation for my project")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(5001);

  console.log(`Application is running on: ${await app.getUrl()}/api#/`);
}
bootstrap();
