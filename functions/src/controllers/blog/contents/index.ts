/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
const app = express();
const cors = require('cors');
require('express-async-errors');

const articles = require('./articles');
const series = require('./series');
// middlewares
app.use(cors({ origin: true })); // CORS

app.use('/articles', articles);
app.use('/series', series);

app.get('/test', async (req: express.Request, res: express.Response) => {
  requestLog('GET BLOG CONTENTS TEST');
  return res.send(true);
});

app.use(require('@/middlewares/errors'));

module.exports = app;
