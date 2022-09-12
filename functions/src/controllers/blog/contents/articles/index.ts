/* eslint-disable no-unused-vars */
import admin from '@/plugins/firebase';

import { statusCode } from '@/types/statusCode';
import { RegistrableController } from '@/controllers/RegistrableController';

import { requestLog } from '@/utils/requestLog';
import express from 'express';
import { articleService } from '@/services/blog/contents/articles';

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

      const { offset, limit, order, sort, category } = req.query;
      if (offset == null || limit == null || order == null)
        throw new Error(statusCode.BAD_REQUEST);
      try {
        const result = await articleService.getArticleCollection({
          offset: Number(offset),
          limit: Number(limit),
          order: order as string,
          sort: sort as 'desc' | 'asc',
          category: category as string,
        });
        res.json(result);
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
        console.log(result);
        res.json(result);
      } catch (err) {
        throw err;
      }
    }
  );
router.use(require('@/middlewares/errors'));

module.exports = router;
