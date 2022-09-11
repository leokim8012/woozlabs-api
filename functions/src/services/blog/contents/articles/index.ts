import { BlogArticleDTO } from '@/models/blog/contents';
import { articleRepository } from '@/repository/blog/contents/articles';
import express from 'express';

export interface ArticleService {
  getArticleById(_id: string): Promise<BlogArticleDTO>;
  // getArticleCollection(): Promise<BlogArticleDTO>;
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
  // async getArticleCollection(): Promise<BlogArticleDTO> {},
};
