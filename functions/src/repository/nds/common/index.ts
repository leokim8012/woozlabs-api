import { NDSDTO, converter } from '@/models/nds/common/nds';
import { db } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';
import express from 'express';

export interface NDSRepository {
  find(id: string): Promise<NDSDTO>;
  findByGameId(uid: string, gameId: string): Promise<NDSDTO>;
  create(data: NDSDTO): Promise<string>;
  update(id: string, data: NDSDTO): Promise<string>;
}

export const NDSRepository: NDSRepository = {
  async find(id: string): Promise<NDSDTO> {
    try {
      const snapshot = await db
        .collection('nds')
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
        .collection('nds')
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
  async create(data: NDSDTO): Promise<string> {
    try {
      const snapshot = await db
        .collection('nds')
        .withConverter(converter)
        .doc(data.id)
        .create(data);
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
        .collection('nds')
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
