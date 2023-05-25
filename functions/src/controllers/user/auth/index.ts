/* tslint:disable:no-unused-variable */
import admin, { storage } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

require('express-async-errors');

// middlewares
app.use(cors({ origin: true, credentials: true })); // CORS
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.headers.cookie);
  next();
});

app.use('/v1/user/auth', require('@/controllers/user/auth/v1'));

app.use(require('@/middlewares/errors'));

exports.auth = functions.https.onRequest(app);
