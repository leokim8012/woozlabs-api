import { BlogArticle } from '@/models/blog/contents';
import express from 'express';

export interface ArticleService {
  getArticleById(_id: string): Promise<BlogArticle>;
  getArticleCollection(): Promise<BlogArticle>;
}

export const articleService: ArticleService = {
  async getArticleById(_id: string): Promise<BlogArticle> {},
  async getArticleCollection(): Promise<BlogArticle> {
    return 'Articles';
  },
};
