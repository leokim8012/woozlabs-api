/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
const app = express();
const cors = require('cors');
require('express-async-errors');

const articles = require('./articles');
const series = require('./series');
// middlewares
app.use(cors({ origin: true })); // CORS

app.use('/articles', articles);
app.use('/series', series);

app.use(require('@/middlewares/errors'));

exports.contents = functions.https.onRequest(app);
