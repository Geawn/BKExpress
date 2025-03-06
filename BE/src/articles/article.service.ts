import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article } from "../schemas/article.schema";
import { Category } from "../schemas/category.schema";
import { Types } from "mongoose";

interface ArticleQuery {
  category?: Types.ObjectId;
  pubDate?: { $lt?: Date; $gt?: Date };
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private readonly articleModel: Model<Article>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  /**
   * Lấy danh sách bài báo theo category với cursor dựa trên pubDate.
   *
   * @param category - Tên danh mục (category) của bài báo.
   * @param limit - Số lượng bài báo cần lấy.
   * @param lastPubDate - Thời gian pubDate của bài báo cuối cùng từ lần gọi trước.
   * @param direction - Hướng phân trang:
   *    - 'older': lấy bài báo cũ hơn (pubDate < lastPubDate)
   *    - 'newer': lấy bài báo mới hơn (pubDate > lastPubDate)
   */
  async getArticles(
    categoryName: string,
    limit: number,
    lastPubDate?: string,
    direction: "newer" | "older" = "older",
  ): Promise<any> {
    const sortOrder = direction === "older" ? -1 : 1;
    const query: ArticleQuery = {};

    if (categoryName !== "General") {
      const categoryDoc = await this.categoryModel
        .findOne({ name: categoryName })
        .exec();
      if (!categoryDoc) throw new Error(`Category ${categoryName} not found`);
      query.category = categoryDoc._id as Types.ObjectId;
    }

    if (lastPubDate) {
      const dateCursor = new Date(lastPubDate);
      if (isNaN(dateCursor.getTime())) {
        throw new Error("Invalid lastPubDate format");
      }
      query.pubDate =
        direction === "older" ? { $lt: dateCursor } : { $gt: dateCursor };
    }

    return this.articleModel
      .find(query)
      .select("title description pubDate source_icon image_url _id")
      .sort({ pubDate: sortOrder })
      .limit(limit)
      .exec();
  }

  async getArticleById(id: string): Promise<Article | null> {
    return this.articleModel
      .findById(new Types.ObjectId(id))
      .populate("category", "name") // Lấy thông tin đầy đủ của category
      .exec();
  }
}
