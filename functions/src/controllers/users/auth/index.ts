/* tslint:disable:no-unused-variable */
import admin, { storage } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS
app.use('/v1/user/auth', require('@/controllers/user/auth/v1'));

app.use(require('@/middlewares/errors'));

exports.auth = functions.https.onRequest(app);
