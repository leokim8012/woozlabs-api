import admin, { db } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
import * as functions from 'firebase-functions';
import express from 'express';
const router = express.Router();
const request = require('request');
import * as sitemap from './sitemap';

// app.autoUpdateSitemap = functions.pubsub
//   .schedule('every day 12:00')
//   .timeZone('America/Los_Angeles')
//   .onRun(async () => sitemap.writeSitemap());

exports.directUpdateSitemap = functions.https.onRequest(async (req, res) => {
  await sitemap.writeSitemap();
  res.send(200).end();
});

const downloadString = async (filePath: string) => {
  return admin
    .storage()
    .bucket()
    .file(filePath)
    .download()
    .then((result) => {
      return Buffer.from(...result).toString();
    })
    .catch((err) => {
      throw new Error(
        `failed to download string at ${filePath} with ${err.code}`
      );
    });
};
exports.sitemap = functions.https.onRequest(async (req, res) => {
  requestLog('blog-sitemap');
  const sitemap = await downloadString('Assets/Blog/sitemap.xml');
  res.send(sitemap);
  return;
});

exports.og = functions.https.onRequest(async (req, res) => {
  const { parse } = require('node-html-parser');
  const fs = require('fs');
  const pluralize = require('pluralize');
  request(
    {
      uri: 'https://blog.woozlabs.com',
    },
    async (error: string, response: string, body: string) => {
      const html: string = body;
      const root: Element = parse(html);

      const ps = req.path.split('/');
      ps.shift();
      if (ps.length === 0) {
        res.send(html);
        return;
      }
      requestLog('blog-og');

      if (ps[0] == 'page') ps.shift();
      const page = pluralize(ps.shift());
      const id = ps.shift();

      let doc = null;
      switch (page) {
        case 'articles':
          if (id) doc = await db.collection('articles').doc(id).get();
          break;
        case 'archive':
          doc = await db.collection('seo').doc('archive').get();
          break;
      }

      if (doc) {
        if (!doc.exists) {
          res.send(html);
          return;
        }

        if (doc.data()) {
          const item = doc.data();

          if (item) {
            const child = <Element>root.lastChild!.childNodes[0];
            const title = <Element>child.childNodes[0];
            const description = <Element>child.childNodes[1];
            const ogTitle = <Element>child.childNodes[2];
            const ogDescription = <Element>child.childNodes[3];
            const ogImage = <Element>child.childNodes[4];

            title.setAttribute('content', item.title);
            description.setAttribute('content', item.subtitle.substr(0, 80));
            ogTitle.setAttribute('content', item.title + ' | WOOZBLOG');
            ogDescription.setAttribute('content', item.subtitle.substr(0, 80));
            ogImage.setAttribute(
              'content',
              item.imageUrl ??
                'https://firebasestorage.googleapis.com/v0/b/woozlabs.appspot.com/o/OG%2FWOOZBLOG-OG.png?alt=media&token=0d6b04fe-d07a-4def-9995-253d982ec30e'
            );
            res.status(200).send(root.toString());
            return;
          }
        }
      }
      res.send(html);
      return;
    }
  );
});
