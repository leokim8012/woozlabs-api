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
// router
//   .route('/')
//   .get(
//     async (
//       req: express.Request,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       requestLog(`GET ARTICLE COLLECTION`);
//       const result = await articleService
//         .getArticleCollection()
//         .catch((err: Error) => next(err));
//       res.json(result);
//     }
//   );

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
        console.log(err);
      }
    }
  );
router.use(require('@/middlewares/errors'));

module.exports = router;
