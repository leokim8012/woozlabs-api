import { BlogArticleDTO } from '@/models/blog/contents';
import {
  articleRepository,
  ArticleRepositoryOptions,
} from '@/repository/blog/contents/articles';
import express from 'express';

export interface ArticleService {
  getArticleById(_id: string): Promise<BlogArticleDTO>;
  getArticleCollection(
    options: ArticleRepositoryOptions
  ): Promise<Array<BlogArticleDTO>>;

  createArticle(articleDTO: BlogArticleDTO): Promise<string>;
}

export const articleService: ArticleService = {
  async getArticleById(_id: string): Promise<BlogArticleDTO> {
    try {
      const data = await articleRepository.find(_id);
      return data;
    } catch (err) {
      throw err;
    }
  },
  async getArticleCollection(
    options: ArticleRepositoryOptions
  ): Promise<Array<BlogArticleDTO>> {
    try {
      const data = await articleRepository.findAll(options);
      return data;
    } catch (err) {
      throw err;
    }
  },
  async createArticle(articleDTO: BlogArticleDTO): Promise<string> {
    try {
      const id = await articleRepository.create(articleDTO);
      return id;
    } catch (err) {
      throw err;
    }
  },
};
