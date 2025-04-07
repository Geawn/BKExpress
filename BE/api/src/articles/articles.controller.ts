// api_server/src/articles/articles.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { GetArticleDto } from './dto/get-article.dto';
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of articles',
    description: 'Retrieves articles filtered by category.',
  })
  @ApiQuery({
    name: 'category',
    type: String,
    required: true,
    description: 'The category name of the articles (required)',
    example: 'Technology',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
    description: 'Number of articles to retrieve (default: 10)',
  })
  @ApiQuery({
    name: 'lastPubDate',
    type: String,
    required: false,
    description: 'Publication date of the last retrieved article (optional)',
  })
  @ApiQuery({
    name: 'direction',
    type: String,
    required: false,
    enum: ['newer', 'older'],
    example: 'older',
    description: 'Pagination direction: "older" (default) or "newer"',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved list of articles.',
    type: [ArticleDto],
  })
  async getArticles(
    @Query('category') category: string,
    @Query('limit') limit: number = 10,
    @Query('lastPubDate') lastPubDate?: string,
    @Query('direction') direction: 'newer' | 'older' = 'older',
  ): Promise<GetArticleDto[]> {
    return await this.articlesService.getArticles(
      category,
      limit,
      lastPubDate,
      direction,
    );
  }

  @Get('article-detail')
  @ApiOperation({
    summary: 'Get article details',
    description: 'Retrieves details of a specific article by ID.',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: true,
    example: '67bc2f4ac9c0f77ccf87ae81',
    description: 'The unique identifier of the article (required)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved article details.',
    type: ArticleDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async getArticleById(@Query('id') id: string): Promise<ArticleDto> {
    return this.articlesService.getArticleById(id);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search articles',
    description: 'Searches articles by content or title.',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: true,
    example: 'đơn',
    description: 'The content or title to search for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved search results.',
    type: [ArticleDto],
  })
  async search(@Query('search') query: string): Promise<ArticleDto[]> {
    return this.articlesService.search(query);
  }
}
