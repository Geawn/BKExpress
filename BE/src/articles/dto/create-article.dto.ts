// articles/dto/create-article.dto.ts
export class CreateArticleDto {
  title: string;
  link: string;
  keywords?: string[];
  video_url?: string;
  description?: string;
  content?: { type: string; value: string }[];
  pubDate: string;
  pubDateTZ: string;
  image_url: string;
  source_id: string;
  source_name: string;
  source_url: string;
  source_icon?: string;
  language?: string;
  category: string; // Crawler gửi chuỗi, server sẽ ánh xạ thành ObjectId
}
