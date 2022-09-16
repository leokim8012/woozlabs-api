// https://api.woozlabs.com/api/docs/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.use(require('@/middlewares/errors'));

module.exports = app;
