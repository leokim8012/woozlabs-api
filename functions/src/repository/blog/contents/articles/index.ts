import { BlogArticleDTO, converter } from '@/models/blog/contents/articles';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';
export interface ArticleRepositoryOptions {
  offset: number;
  limit: number;
  order: string;
  sort: 'desc' | 'asc';
  category?: string;
}
export interface ArticleRepository {
  find(_id: string): Promise<BlogArticleDTO>;
  findAll(options: ArticleRepositoryOptions): Promise<Array<BlogArticleDTO>>;
  create(articleDTO: BlogArticleDTO): Promise<string>;
  update(articleDTO: BlogArticleDTO): Promise<boolean>;
}

export const articleRepository: ArticleRepository = {
  async find(_id: string) {
    try {
      const snapshot = await db
        .collection('posts')
        .withConverter(converter)
        .doc(_id)
        .get();

      const data = snapshot.data();
      if (data) {
        return data;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },

  async findAll(
    _option: ArticleRepositoryOptions
  ): Promise<Array<BlogArticleDTO>> {
    const option = _option;

    if (option.category && option.category != 'All') {
      try {
        const snapshot = await db
          .collection('articles')
          .where('category', '==', option.category)
          .withConverter(converter)
          .get();
        const data = snapshot.docs.map((doc) => {
          return doc.data();
        });
        if (data) {
          return data;
        }
      } catch (e) {
        throw e;
      }
    } else {
      try {
        const snapshot = await db
          .collection('articles')
          .orderBy(option.order, option.sort)
          .offset(option.offset)
          .limit(option.limit)
          .withConverter(converter)
          .get();
        const data = snapshot.docs.map((doc) => {
          return doc.data();
        });
        if (data) {
          return data;
        }
      } catch (e) {
        throw e;
      }
    }
    throw new Error(statusCode.BAD_REQUEST);
  },

  async create(articleDTO: BlogArticleDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('articles')
        .withConverter(converter)
        .doc(articleDTO.id)
        .create(articleDTO);
      const id = articleDTO.id;
      if (id) {
        return id;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },

  async update(articleDTO: BlogArticleDTO): Promise<boolean> {
    return false;
  },
};
