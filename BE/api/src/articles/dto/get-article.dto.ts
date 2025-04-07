import { ApiProperty } from '@nestjs/swagger';

export class GetArticleDto {
  @ApiProperty({
    description: 'Title of the article',
    example: 'Sample Article Title',
  })
  title: string;
  @ApiProperty({
    description: 'Description of the article',
    example: 'Sample article description.',
  })
  description?: string;
  @ApiProperty({
    description: 'Publication date of the article',
    example: '2023-10-01T12:00:00Z',
  })
  pubDate: Date;
  @ApiProperty({
    description: 'Source icon of the article',
    example: 'https://example.com/icon.png',
  })
  source_icon?: string;
  @ApiProperty({
    description: 'Image URL of the article',
    example: 'https://example.com/image.png',
  })
  image_url: string;
  @ApiProperty({
    description: 'Unique identifier of the article',
    example: '60d5ec49f1c4e3b8f8e4a2b0',
  })
  _id: string;
}
