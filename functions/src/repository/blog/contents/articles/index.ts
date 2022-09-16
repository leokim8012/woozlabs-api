import { BlogArticleDTO, converter } from '@/models/blog/contents/articles';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';
export interface ArticleRepositoryOptions {
  limit: number;
  order: string;
  sort: 'desc' | 'asc';
  offset?: number;
  search?: [string, any];
}
export interface ArticleRepositoryResponse {
  items: Array<BlogArticleDTO>;
  totalCount: number;
}
export interface ArticleRepository {
  find(_id: string): Promise<BlogArticleDTO>;
  findAll(
    options: ArticleRepositoryOptions
  ): Promise<ArticleRepositoryResponse>;
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
  ): Promise<ArticleRepositoryResponse> {
    const option = _option;

    if (option.search && option.search[0] && option.search[0] != 'All') {
      try {
        let t = null;
        switch (option.search[0]) {
          case 'category':
            t = await (
              await db
                .collection('infos')
                .doc('articles')
                .collection('categories')
                .doc((option.search[1] as string).toLowerCase())
                .get()
            ).data();
            break;
        }
        let totalCount = 0;
        if (t) totalCount = t.totalCount;
        const snapshot = await db
          .collection('articles')
          .withConverter(converter)
          .where(option.search[0], '==', option.search[1])
          .orderBy(option.order, option.sort)
          .offset(option.offset ?? 0)
          .limit(option.limit)
          .get();

        const data = snapshot.docs.map((doc) => {
          return doc.data();
        });
        if (data) {
          return {
            items: data,
            totalCount: totalCount,
          };
        }
      } catch (e) {
        throw e;
      }
    } else {
      try {
        const t = await (
          await db.collection('infos').doc('articles').get()
        ).data();
        const totalCount = t?.totalCount;
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
          return {
            items: data,
            totalCount: totalCount,
          };
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
