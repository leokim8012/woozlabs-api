/* tslint:disable:no-unused-variable */
import admin from '@/plugins/firebase';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');
import { requestLog } from '@/utils/requestLog';
import { RegistrableController } from '@/controllers/RegistrableController';

import container from './configs/dependencies';
import TYPES from './configs/types';
// middlewares
app.use(cors({ origin: true })); // CORS

// grabs the Controller from IoC container and registers all the endpoints
const controllers: RegistrableController[] =
  container.getAll<RegistrableController>(TYPES.Controller);
controllers.forEach((controller) => controller.register(app));

app.use(require('@/middlewares/errors'));

module.exports = app;
