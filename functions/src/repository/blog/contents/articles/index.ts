import { BlogArticleDTO, converter } from '@/models/blog/contents/articles';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';
export interface ArticleRepositoryOptions {
  limit: number;
  order?: string;
  sort?: 'desc' | 'asc';
  offset?: number;
  search?: [string, any];
}
export interface ArticleRepository {
  find(_id: string): Promise<BlogArticleDTO>;
  findAll(options: ArticleRepositoryOptions): Promise<Array<BlogArticleDTO>>;
  create(articleDTO: BlogArticleDTO): Promise<string>;
  update(id: string, articleDTO: BlogArticleDTO): Promise<string>;
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
    } catch (e) {
      throw e;
    }
  },

  async findAll(
    _option: ArticleRepositoryOptions
  ): Promise<Array<BlogArticleDTO>> {
    const option = _option;

    if (option.search && option.search[0] && option.search[0] != 'All') {
      try {
        const snapshot = await db
          .collection('articles')
          .withConverter(converter)
          .where(option.search[0], '==', option.search[1])
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
          .withConverter(converter)
          .orderBy(option.order, option.sort)
          .offset(option.offset ?? 0)
          .limit(option.limit)
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

  async update(_id: string, articleDTO: BlogArticleDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('articles')
        .withConverter(converter)
        .doc(_id)
        .set(articleDTO);
      const id = articleDTO.id;
      if (id) {
        return id;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },
};

const _filterSearchValue = (value: string) => {};
