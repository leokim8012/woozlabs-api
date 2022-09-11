/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');
import { requestLog } from '@/utils/requestLog';

// middlewares
app.use(cors({ origin: true })); // CORS

app.use('/contents', require('./contents'));
app.use(require('@/middlewares/errors'));

module.exports = app;
