import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "Article", timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop()
  author?: string;

  @Prop()
  image_url?: string;

  @Prop()
  content?: string;

  @Prop()
  pubDate: Date;

  @Prop()
  source_name: string;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId; // Tham chiếu đến Category
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
