/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
import { requestLog } from '@/utils/requestLog';
const router = express.Router();
const cors = require('cors');
require('express-async-errors');

const articles = require('./articles');
const series = require('./series');
// middlewares
router.use(cors({ origin: true })); // CORS

router.use('/articles', articles);
router.use('/series', series);

router.use(require('@/middlewares/errors'));

module.exports = router;
