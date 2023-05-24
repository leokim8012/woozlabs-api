import { UserAuthDTO, UserConverter } from '@/models/user';
import admin, { db } from '@/plugins/firebase';
import { RepositoryOptions } from '@/types/repository';
import { statusCode } from '@/types/statusCode';
import express from 'express';
export interface UserAuthRepositoryResponse {
  items: Array<UserAuthDTO>;
  totalCount: number;
}
export interface UserAuthRepository {
  find(uid: string): Promise<UserAuthDTO | null>;
  findWithValue(
    value: string,
    where: string,
    operator: admin.firestore.WhereFilterOp,
    limit: number
  ): Promise<UserAuthDTO | null>;
  findAll(options: RepositoryOptions): Promise<UserAuthRepositoryResponse>;
  create(userAuth: UserAuthDTO): Promise<string>;
  update(id: string, userAuth: UserAuthDTO): Promise<string>;
}

export const userAuthRepository: UserAuthRepository = {
  async find(uid: string) {
    try {
      const snapshot = await db
        .collection('users')
        .withConverter(UserConverter)
        .doc(uid)
        .get();

      let data = null;
      data = snapshot.data();
      if (data == undefined) data = null;
      return data;
    } catch (e) {
      throw e;
    }
  },

  async findWithValue(
    where: string,
    value: string,
    operator: admin.firestore.WhereFilterOp = '==',
    limit: number = 1
  ) {
    try {
      const snapshot = await db
        .collection('users')
        .withConverter(UserConverter)
        .where(where, operator, value)
        .limit(limit)
        .get();

      let data = null;
      if (snapshot.docs.length > 0) data = snapshot.docs[0].data();
      return data;
    } catch (e) {
      throw e;
    }
  },

  async findAll(
    _option: RepositoryOptions
  ): Promise<UserAuthRepositoryResponse> {
    const option = _option;

    if (option.where && option.where.path && option.where.path != 'All') {
      try {
        let t = null;
        switch (option.where.path) {
          case 'category':
            t = await (
              await db
                .collection('infos')
                .doc('users')
                .collection('categories')
                .doc((option.where.value as string).toLowerCase())
                .get()
            ).data();
            break;
        }
        let totalCount = 0;
        if (t) totalCount = t.totalCount;
        const snapshot = await db
          .collection('users')
          .withConverter(UserConverter)
          .where(option.where.path, '==', option.where.value)
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
          await db.collection('infos').doc('users').get()
        ).data();
        const totalCount = t?.totalCount;
        const snapshot = await db
          .collection('users')
          .withConverter(UserConverter)
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

  async create(userAuth: UserAuthDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('users')
        .withConverter(UserConverter)
        .doc(userAuth.uid)
        .create(userAuth);
      const id = userAuth.uid;
      if (id) {
        return id;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },

  async update(uid: string, userAuth: UserAuthDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('users')
        .withConverter(UserConverter)
        .doc(uid)
        .set(userAuth);
      const id = userAuth.uid;
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
