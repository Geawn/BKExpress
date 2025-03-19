// articles/dto/create-article.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ContentItem {
  @ApiProperty({
    enum: ["text", "image", "video", "quote", "list"],
    description: "Type of content",
  })
  type: string;

  @ApiProperty({
    description:
      "Value of the content (string for text/image/video/quote, array for list)",
  })
  value: string | string[];
}

export class CreateArticleDto {
  @ApiProperty({ description: "Title of the article" })
  title: string;

  @ApiProperty({ description: "URL of the article" })
  link: string;

  @ApiPropertyOptional({
    description: "Keywords associated with the article",
    type: [String],
  })
  keywords?: string[];

  @ApiPropertyOptional({ description: "URL of the video (if any)" })
  video_url?: string;

  @ApiPropertyOptional({ description: "Short description of the article" })
  description?: string;

  @ApiPropertyOptional({
    description: "Content of the article",
    type: [ContentItem],
  })


  content?: { type: string; value: string }[];

  @ApiProperty({ description: "Publication date of the article" })
  pubDate: string;

  @ApiProperty({ description: "Timezone of the publication date" })
  pubDateTZ: string;

  @ApiProperty({ description: "URL of the main image" })
  image_url: string;

  @ApiProperty({ description: "Unique identifier of the source" })
  source_id: string;

  @ApiProperty({ description: "Name of the source" })
  source_name: string;

  @ApiProperty({ description: "URL of the source website" })
  source_url: string;

  @ApiPropertyOptional({ description: "URL of the source icon" })
  source_icon?: string;

  @ApiPropertyOptional({
    description: "Language of the article",
    default: "vietnamese",
  })
  language?: string;

  @ApiProperty({
    description: "Category name of the article (e.g., News, Economy)",
  })

  category: string;
}
