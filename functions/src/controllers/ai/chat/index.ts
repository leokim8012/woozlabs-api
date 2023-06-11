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

app.use('/v1/ai/chat', require('@/controllers/ai/chat/v1'));

app.use(require('@/middlewares/errors'));

exports.chat = functions.https.onRequest(app);
