import { NDSDTO } from '@/models/nds/common';
import express from 'express';
import { NDSRepository } from '@/repository/nds/common/index';

export interface NDSService {
  getNDSDataById(id: string): Promise<NDSDTO>;
  getNDSDataByGameId(uid: string, gameId: string): Promise<NDSDTO>;
  updateNDSDataById(id: string, data: NDSDTO): Promise<string>;
}

export const NDSService: NDSService = {
  async getNDSDataById(id: string): Promise<NDSDTO> {
    try {
      const data = await NDSRepository.find(id);
      return data;
    } catch (err) {
      throw err;
    }
  },
  async getNDSDataByGameId(uid: string, gameId: string): Promise<NDSDTO> {
    try {
      const data = await NDSRepository.findByGameId(uid, gameId);
      return data;
    } catch (err) {
      throw err;
    }
  },
  async updateNDSDataById(_id: string, data: NDSDTO): Promise<string> {
    try {
      const id = await NDSRepository.update(_id, data);
      return id;
    } catch (err) {
      throw err as Error;
    }
  },
};
