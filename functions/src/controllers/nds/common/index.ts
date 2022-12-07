/* tslint:disable:no-unused-variable */
import admin, { storage } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
import express from 'express';
import { statusCode } from '@/types/statusCode';
import { NDSService } from '@/services/nds/common';
import { Blob } from 'node:buffer';
import firebase from 'firebase/compat/app';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.get(
  '/save/:uid/:id',
  async (req: express.Request, res: express.Response) => {
    if (!req.params.id || !req.params.uid)
      throw new Error(statusCode.BAD_REQUEST);
    requestLog('GET NDS SAVE');
    try {
      const history = await NDSService.getLastestNDSHistory(
        req.params.uid,
        req.params.id
      );
      const url = await storage
        .bucket()
        .file(history.dataPath)
        .getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 1 * 60 * 1000, // 1 minutes
        });
      res.send(url[0]);
    } catch (err) {
      throw err as Error;
    }
  }
);
app.post('/save/:uid', async (req: express.Request, res: express.Response) => {
  if (!req.params.uid || !req.body) throw new Error(statusCode.BAD_REQUEST);
  requestLog('POST NDS SAVE');
  try {
    const array = Uint8Array.from(Object.values(req.body.data));
    const data = Buffer.from(array);
    await storage
      .bucket()
      .file(`NDS/${req.params.uid}/${req.body.gameId.replaceAll(' ', '')}.sav`)
      .save(data, {
        resumable: false,
        metadata: { contentType: 'application/binary' },
      });

    const result = await NDSService.createNDSHistory({
      id: req.params.id,
      dataPath: `NDS/${req.params.uid}/${req.body.gameId.replaceAll(
        ' ',
        ''
      )}.sav`,
      uid: req.params.uid,
      gameId: req.body.gameId,
    });
    res.json(result);
  } catch (err) {
    throw err;
  }
  return res.send(true);
});
app.use(require('@/middlewares/errors'));

exports.common = functions.https.onRequest(app);
