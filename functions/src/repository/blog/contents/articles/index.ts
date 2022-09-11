import { BlogArticleDTO, converter } from '@/models/blog/contents/articles';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';
export interface ArticleRepositoryOptions {}
export interface ArticleRepository {
  find(_id: string): Promise<BlogArticleDTO>;
  //   findAll(options?: ArticleRepositoryOptions): Promise<Array<BlogArticle>>;
  //   create(articleDTO: BlogArticle): boolean;
  //   update(articleDTO: BlogArticle): boolean;
}

export const articleRepository: ArticleRepository = {
  async find(_id: string) {
    try {
      const snapshot = await db
        .collection('articles')
        .withConverter(converter)
        .doc(_id)
        .get();

      const data = snapshot.data();
      if (data) {
        return data;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (err) {
      throw err;
    }
  },
};
