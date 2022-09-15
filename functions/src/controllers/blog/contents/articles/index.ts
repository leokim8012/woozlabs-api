/* eslint-disable no-unused-vars */
import admin from '@/plugins/firebase';

import { statusCode } from '@/types/statusCode';
import { RegistrableController } from '@/controllers/RegistrableController';

import { requestLog } from '@/utils/requestLog';
import express from 'express';
import { articleService } from '@/services/blog/contents/articles';
import * as functions from 'firebase-functions';

require('express-async-errors');
const cors = require('cors');

const router = express.Router();
// middlewares

router.use(cors({ origin: true }));
router
  .route('/')
  .post(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!req.body.id) throw new Error(statusCode.BAD_REQUEST);
      requestLog(`POST ARTICLE ${req.body.id}`);
      try {
        const result = await articleService.createArticle(req.body);
        res.json(result);
      } catch (err) {
        throw err;
      }
    }
  )
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      requestLog(`GET ARTICLE COLLECTION`);

      const { offset, limit, order, sort, search } = req.query;

      if (limit == null || order == null || sort == null)
        throw new Error(statusCode.BAD_REQUEST);

      try {
        const result = await articleService.getArticleCollection({
          offset: offset ? Number(offset) : 0,
          limit: Number(limit),
          order: (order as string) ?? 'createdAt',
          sort: (sort as 'desc' | 'asc') ?? 'desc',
          search: search as [string, string],
        });
        res.json(result);
      } catch (err) {
        throw err as Error;
      }
    }
  );

router
  .route('/recommend')
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      requestLog(`GET RECOMMEND ARTICLES`);

      const { offset, limit } = req.query;

      if (limit == null) throw new Error(statusCode.BAD_REQUEST);

      try {
        const result = await articleService.getArticleCollection({
          offset: offset ? Number(offset) : 0,
          limit: Number(limit),
          order: 'updatedAt',
          sort: 'desc',
          search: ['recommend', true],
        });
        res.json(result.items);
      } catch (err) {
        throw err;
      }
    }
  );

router
  .route('/:id')
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!req.params.id) throw new Error(statusCode.BAD_REQUEST);
      requestLog(`GET ARTICLE ${req.params.id}`);
      try {
        const result = await articleService.getArticleById(req.params.id);
        res.json(result);
      } catch (err) {
        throw err;
      }
    }
  )
  .put(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!req.params.id || !req.body.id)
        throw new Error(statusCode.BAD_REQUEST);
      requestLog(`UPDATE ARTICLE ${req.params.id}`);
      try {
        const result = await articleService.updateArticle(
          req.params.id,
          req.body
        );
        res.json(result);
      } catch (err) {
        throw err;
      }
    }
  );
router.use(require('@/middlewares/errors'));

module.exports = router;
