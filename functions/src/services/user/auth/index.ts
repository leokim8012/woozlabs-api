import { UserAuthDTO } from '@/models/user';
import {
  userAuthRepository,
  UserAuthRepositoryResponse,
} from '@/repository/user/auth';

import { RepositoryOptions } from '@/types/repository';
import express from 'express';

export interface UserAuthService {
  getUserByUid(_id: string): Promise<UserAuthDTO | null>;
  getUserByUserName(value: string): Promise<UserAuthDTO | null>;
  updateUser(id: string, userAuth: UserAuthDTO): Promise<string>;
}

export const userAuthService: UserAuthService = {
  async getUserByUid(_id: string): Promise<UserAuthDTO | null> {
    try {
      const data = await userAuthRepository.find(_id);
      return data;
    } catch (err) {
      throw err;
    }
  },
  async getUserByUserName(value: string): Promise<UserAuthDTO | null> {
    try {
      const data = await userAuthRepository.findWithValue(
        'userName',
        value,
        '==',
        1
      );
      return data;
    } catch (err) {
      throw err;
    }
  },
  async updateUser(_id: string, userAuth: UserAuthDTO): Promise<string> {
    try {
      const id = await userAuthRepository.update(_id, userAuth);
      return id;
    } catch (err) {
      throw err;
    }
  },
};
