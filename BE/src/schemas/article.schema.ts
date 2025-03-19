// articles/schemas/article.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @ApiProperty({ description: "Unique identifier of the article" })
  _id: string;

  @ApiProperty({ description: "Title of the article" })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: "URL of the article" })
  @Prop({ required: true, unique: true })
  link: string;

  @ApiProperty({
    description: "Keywords associated with the article",
    type: [String],
    required: false,
  })
  @Prop([String])
  keywords?: string[];

  @ApiProperty({ description: "URL of the video (if any)", required: false })
  @Prop()
  video_url?: string;
 
  @ApiProperty({
    description: "Short description of the article",
    required: false,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: "Content of the article",
    type: [Object],
    required: false,
  })
  @Prop([
    {
      type: { type: String, enum: ["text", "image", "video", "quote", "list"] },
      value: { type: MongooseSchema.Types.Mixed }, // Hỗ trợ cả chuỗi và mảng
    },
  ])
  content?: { type: string; value: string | string[] }[];

  @ApiProperty({ description: "Publication date of the article" })
  @Prop()
  pubDate: string;

  @ApiProperty({ description: "Timezone of the publication date" })
  @Prop()
  pubDateTZ: string;

  @ApiProperty({ description: "URL of the main image" })
  @Prop()
  image_url: string;

  @ApiProperty({ description: "Unique identifier of the source" })
  @Prop()
  source_id: string;

  @ApiProperty({ description: "Name of the source" })
  @Prop()
  source_name: string;

  @ApiProperty({ description: "URL of the source website" })
  @Prop()
  source_url: string;

  @ApiProperty({ description: "URL of the source icon", required: false })
  @Prop()
  source_icon?: string;

  @ApiProperty({
    description: "Language of the article",
    default: "vietnamese",
  })
  @Prop({ default: "vietnamese" })
  language: string;

  @ApiProperty({ description: "Category ID of the article" })
  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;

  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;

  @ApiProperty({ description: "Last update timestamp" })
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
