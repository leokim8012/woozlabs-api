import express from 'express';
import { injectable, inject } from 'inversify';

export interface ArticleService {
  getArticleById(id: string): Promise<string>;
  getArticleCollection(): Promise<string>;
  //   getAddresses(): Promise<Array<Address>>;
  //   createAddress(address: Address): Promise<Address>;
  //   updateAddress(address: Address): Promise<Address>;
  //   getAddress(id: string): Promise<Address>;
}

@injectable()
export class ArticleServiceImpl implements ArticleService {
  public async getArticleById(_id: string): Promise<string> {
    const id = _id;
    return id;
  }
  public async getArticleCollection(): Promise<string> {
    return 'Articles';
  }
}
