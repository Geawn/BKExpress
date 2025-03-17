// articles/schemas/article.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ArticleDocument = Article & Document;

@Schema({ collection: "Article" }) // Giữ createdAt, updatedAt
// @Schema({}) // Không giữ createdAt, updatedAt
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop([String]) // Mảng chuỗi hoặc null
  keywords?: string[];

  @Prop()
  video_url?: string;

  @Prop()
  description?: string;

  @Prop([{ type: { type: String, enum: ["text", "image"] }, value: String }]) // Có thể null
  content?: { type: string; value: string }[];

  @Prop()
  pubDate: string;

  @Prop()
  pubDateTZ: string;

  @Prop()
  image_url: string;

  @Prop()
  source_id: string;

  @Prop()
  source_name: string;

  @Prop()
  source_url: string;

  @Prop()
  source_icon?: string;

  @Prop({ default: "vietnamese" })
  language: string;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
