import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ArticlesService } from "./article.service";
import { ArticlesController } from "./article.controller";
import { Article, ArticleSchema } from "../schemas/article.schema";
import { Category, CategorySchema } from "../schemas/category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
