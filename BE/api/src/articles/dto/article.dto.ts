import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({
    description: 'Unique identifier of the article',
    example: '67d0b447c5c0cb20d3fc6a14',
  })
  _id: string;

  @ApiProperty({ description: 'Title of the article' })
  title: string;

  @ApiProperty({ description: 'URL of the article' })
  link: string;

  @ApiProperty({
    description: 'Keywords associated with the article',
    type: [String],
    required: false,
  })
  keywords?: string[];

  @ApiProperty({ description: 'URL of the video (if any)', required: false })
  video_url?: string;

  @ApiProperty({
    description: 'Short description of the article',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Content of the article',
    type: [Object],
    required: false,
  })
  content?: { type: string; value: string | string[] }[];

  @ApiProperty({ description: 'Publication date of the article' })
  pubDate: Date;

  @ApiProperty({ description: 'Timezone of the publication date' })
  pubDateTZ: string;

  @ApiProperty({ description: 'URL of the main image' })
  image_url: string;

  @ApiProperty({ description: 'Unique identifier of the source' })
  source_id: string;

  @ApiProperty({ description: 'Name of the source' })
  source_name: string;

  @ApiProperty({ description: 'URL of the source website' })
  source_url: string;

  @ApiProperty({ description: 'ID of the articel', required: false })
  source_icon?: string;

  @ApiProperty({
    description: 'Language of the article',
    default: 'vietnamese',
  })
  language: string;

  @ApiProperty({
    description: 'Category ID of the article',
    example: '67bc33f9c9c0f77ccf87aeae',
  })
  category: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-03-16T14:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-03-16T14:00:00.000Z',
  })
  updatedAt: Date;
}
