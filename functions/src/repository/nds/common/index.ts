import { NDSDTO, converter } from '@/models/nds/common/nds';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';

export interface NDSRepository {
  find(id: string): Promise<NDSDTO>;
  findByGameId(uid: string, gameId: string): Promise<NDSDTO>;
  findLatestHistoryByGameId(uid: string, gameId: string): Promise<NDSDTO>;
  create(data: NDSDTO): Promise<string>;
  update(id: string, data: NDSDTO): Promise<string>;
}

export const NDSRepository: NDSRepository = {
  async find(id: string): Promise<NDSDTO> {
    try {
      const snapshot = await db
        .collection('ndsHistory')
        .withConverter(converter)
        .doc(id)
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
  async findByGameId(uid: string, gameId: string): Promise<NDSDTO> {
    try {
      const snapshot = await db
        .collection('ndsHistory')
        .withConverter(converter)
        .where('uid', '==', uid)
        .where('gameId', '==', gameId)
        .get();

      // const data = snapshot.docs();
      // if (data) {
      // return data;
      // }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },
  async findLatestHistoryByGameId(
    uid: string,
    gameId: string
  ): Promise<NDSDTO> {
    try {
      const snapshot = await db
        .collection('ndsHistory')
        .where('uid', '==', uid)
        .where('gameId', '==', gameId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .withConverter(converter)
        .get();
      const data = snapshot.docs.pop()?.data();
      if (data) {
        return data;
      } else {
        throw new Error(statusCode.NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  },
  async create(data: NDSDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('ndsHistory')
        .withConverter(converter)
        .add(data);
      const id = data.id;
      if (id) {
        return id;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },
  async update(_id: string, data: NDSDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('ndsHistory')
        .withConverter(converter)
        .doc(_id)
        .set(data);
      const id = data.id;
      if (id) {
        return id;
      }
      throw new Error(statusCode.BAD_REQUEST);
    } catch (e) {
      throw e;
    }
  },
};
