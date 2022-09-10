/* eslint-disable no-unused-vars */
import admin from '@/plugins/firebase';
import express from 'express';
const app = express();
const cors = require('cors');
require('express-async-errors');

// middlewares
app.use(cors({ origin: true })); // CORS

app.get(
  '/getServerTime',
  async (req: express.Request, res: express.Response) => {
    console.log(`===GET SERVER TIME===\n${new Date()}`);

    const time = admin.firestore.Timestamp.now().toDate().toISOString();
    return res.send(time);
  }
);
app.get(
  '/getServerStatus',
  async (req: express.Request, res: express.Response) => {
    console.log(`===GET SERVER STATUS===\n${new Date()}`);
    return res.send(true);
  }
);
app.get(
  '/getServerVersion',
  async (req: express.Request, res: express.Response) => {
    console.log(`===GET SERVER VERSION===\n${new Date()}`);
    console.log(new Date());

    let version = '';
    if (process.env.node_env === 'production')
      version = process.env.PRODUCTION_BACKEND_VERSION as string;
    if (process.env.node_env === 'development')
      version = process.env.DEV_BACKEND_VERSION as string;
    return res.send(version);
  }
);

app.use(require('@/middlewares/errors'));

module.exports = app;
