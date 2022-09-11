import { BlogArticle } from '@/models/blog/contents';
import { articleRepository } from '@/repository/blog/contents/articles';
import express from 'express';

export interface ArticleService {
  getArticleById(_id: string): Promise<BlogArticle>;
  // getArticleCollection(): Promise<BlogArticle>;
}

export const articleService: ArticleService = {
  async getArticleById(_id: string): Promise<BlogArticle> {
    const data = await articleRepository.find(_id);
    return data;
  },
  // async getArticleCollection(): Promise<BlogArticle> {},
};
