/* eslint-disable no-unused-vars */
import admin from '@/plugins/firebase';

import { statusCode } from '@/types/statusCode';
import { RegistrableController } from '@/controllers/RegistrableController';

import { requestLog } from '@/utils/requestLog';
import express from 'express';
import {
  ArticleService,
  ArticleServiceImpl,
} from '@/services/blog/contents/articles';
import { injectable, inject } from 'inversify';
import TYPES from '@/controllers/blog/configs/types';

require('express-async-errors');
const cors = require('cors');
// middlewares

@injectable()
export class ArticleController implements RegistrableController {
  private articleService: ArticleService;

  constructor(@inject(TYPES.ArticleService) articleService: ArticleService) {
    this.articleService = articleService;
  }

  public register(app: express.Application): void {
    app.use(cors({ origin: true }));
    app
      .route('/:id')
      .get(
        async (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          if (!req.params.id) throw new Error(statusCode.BAD_REQUEST);
          requestLog(`GET ARTICLE ${req.params.id}`);
          const result = await this.articleService
            .getArticleById(req.params.id)
            .catch((err) => next(err));
          res.json(result);
        }
      );

    app.use(require('@/middlewares/errors'));
  }
}
