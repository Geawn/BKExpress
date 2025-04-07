// api_server/src/articles/articles.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ArticleDto } from './dto/article.dto';
import { GetArticleDto } from './dto/get-article.dto';
@Injectable()
export class ArticlesService {
  constructor(private readonly httpService: HttpService) {}

  private readonly baseUrl =
    process.env.ARTICLES_SERVICE_URL || 'http://localhost:5001';
  private readonly articlesUrl = `${this.baseUrl}/articles`;

  async getArticles(
    category: string,
    limit: number = 10,
    lastPubDate?: string,
    direction: 'newer' | 'older' = 'older',
  ): Promise<GetArticleDto[]> {
    try {
      const response = await firstValueFrom<{ data: GetArticleDto[] }>(
        this.httpService.get(this.articlesUrl, {
          params: { category, limit, lastPubDate, direction },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to fetch articles',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArticleById(id: string): Promise<ArticleDto> {
    try {
      const response = await firstValueFrom<{ data: ArticleDto }>(
        this.httpService.get(`${this.articlesUrl}/article-detail`, {
          params: { id },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to fetch article',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async search(query: string): Promise<ArticleDto[]> {
    try {
      const response = await firstValueFrom<{ data: ArticleDto[] }>(
        this.httpService.get(`${this.articlesUrl}/search`, {
          params: { search: query },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new HttpException(
        axiosError.response?.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? String(axiosError.response.data.message)
          : 'Failed to search articles',
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
