import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Article } from "../schemas/article.schema";
import { Category } from "../schemas/category.schema";
import { Types } from "mongoose";
import { CreateArticleDto } from "./dto/create-article.dto";
import { Mutex } from "async-mutex";
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
  ): Promise<Article[]> {
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

  async createArticles(createArticleDtos: CreateArticleDto[]): Promise<Article[]> {
    const mutex = new Mutex();
    const release = await mutex.acquire();

    try {
      // Lấy tất cả các link từ DTOs
      const links = createArticleDtos.map(dto => dto.link);
      
      // Kiểm tra các bài viết đã tồn tại
      const existingArticles = await this.articleModel.find({ link: { $in: links } });
      const existingLinks = new Set(existingArticles.map(article => article.link));
      
      // Lọc ra các bài viết mới
      const newArticles = createArticleDtos.filter(dto => !existingLinks.has(dto.link));
      
      if (newArticles.length === 0) {
        return [];
      }

      // Lấy category cho các bài viết mới
      const categoryMap = new Map();
      for (const dto of newArticles) {
        if (!categoryMap.has(dto.category)) {
          const category = await this.categoryModel.findOne({ name: dto.category });
          if (!category) {
            throw new BadRequestException(`Category ${dto.category} not found`);
          }
          categoryMap.set(dto.category, category._id);
        }
        console.log(`Title: ${dto.title}`);
        console.log(`Original pubDate: ${dto.pubDate}`);
        console.log(`Converted pubDate (GMT+7): ${new Date(dto.pubDate).toISOString()}`);
      }

      // Tạo các bài viết mới
      const articlesToCreate = newArticles.map(dto => {
        const originalDate = new Date(dto.pubDate);
        const adjustedDate = new Date(originalDate.getTime() - 7 * 60 * 60 * 1000); // Subtract 7 hours
        return {
          ...dto,
          category: categoryMap.get(dto.category),
          pubDate: adjustedDate.toISOString(),
          language: dto.language || 'vietnamese'
        };
      });

      const createdArticles = await this.articleModel.insertMany(articlesToCreate);
      return createdArticles.map(article => ({
        ...article,
        pubDate: new Date(article.pubDate)
      })) as Article[];
    } finally {
      release();
    }
  }

  async search(query: string) {
    return this.articleModel.aggregate([
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              {
                text: {
                  query: query,
                  path: 'title',
                  fuzzy: { maxEdits: 2 },
                  score: { boost: { value: 5 } }
                }
              },
              {
                text: {
                  query: query,
                  path: 'content',
                  score: { boost: { value: 2 } }
                }
              }
            ]
          }
        }
      },
      { $limit: 10 }
    ]);
  }
  
}
