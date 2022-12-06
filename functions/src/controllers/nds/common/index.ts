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

app.get('/save/:id', async (req: express.Request, res: express.Response) => {
  if (!req.params.id) throw new Error(statusCode.BAD_REQUEST);
  requestLog('GET NDS SAVE');
  try {
    const result = await NDSService.getNDSDataById(req.params.id);
    res.json(result);
  } catch (err) {
    throw err as Error;
  }
});
app.post('/save/:id', async (req: express.Request, res: express.Response) => {
  if (!req.params.id || !req.body) throw new Error(statusCode.BAD_REQUEST);
  requestLog('POST NDS SAVE');
  try {
    // const blob = new Blob([req.body.data], { type: 'application/binary' });
    // console.log(blob);
    const array = Uint8Array.from(Object.values(req.body.data));
    const data = Buffer.from(array);
    await storage
      .bucket()
      .file(`NDS/${req.body.uid}/${req.body.gameId}.sav`)
      .save(data, {
        resumable: false,
        metadata: { contentType: 'application/binary' },
      });
    const result = await NDSService.updateNDSDataById(req.params.id, {
      id: req.params.id,
      dataPath: `NDS/${req.body.uid}/${req.body.gameId}.sav`,
      uid: req.body.uid,
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
