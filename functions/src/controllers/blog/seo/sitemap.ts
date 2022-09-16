import admin, { db } from '@/plugins/firebase';
import { requestLog } from '@/utils/requestLog';
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { xml } = require('cheerio');
const { link } = require('fs');
import { SaveOptions } from '@google-cloud/storage/build/src/file';
import { converter } from '@/models/blog/contents/articles';

interface Sitemap {
  url: string;
  img: {
    url: any;
    title: string;
  }[];
  lastmod: string;
}
[];
const getArticleUrls = async () => {
  const articles = await db
    .collection('articles')
    .withConverter(converter)
    .get()
    .then((snap) => snap.docs.map((doc) => doc.data()));

  const items: Sitemap[] = [];
  for await (const article of articles) {
    items.push({
      url: `article/${article.id}`,
      img: [
        {
          url: article.imageUrl,
          title: article.title + ' | WOOZBLOG',
        },
      ],
      lastmod: article.updatedAt?.toISOString() || new Date().toISOString(),
    });
  }
  return Promise.resolve(items);
};

const getAllUrls = async () => {
  return await getArticleUrls();
};

const uploadFile = async (
  filePath: string,
  data: string,
  opts: SaveOptions
) => {
  const storage = admin.storage().bucket();
  try {
    await storage.file(filePath).save(data, opts);
    return;
  } catch (e) {
    console.log("couldn't upload", filePath);
  }
};

const createSitemap = async (data: {
  urls: Array<Sitemap>;
  hostname: string;
}) => {
  const links = data.urls;
  const stream = new SitemapStream({ hostname: data.hostname });
  const result = await streamToPromise(Readable.from(links).pipe(stream));
  return result;
};

export const writeSitemap = async () => {
  requestLog('BLOG SITEMAP UPDATED');
  const urls = await getAllUrls();
  const xml = await createSitemap({
    urls,
    hostname: 'https://blog.woozlabs.com/',
  });

  const now = Date.now();
  module.exports;
  await uploadFile('Assets/Blog/sitemap.xml', xml.toString(), {
    gzip: true,
    contentType: 'text/xml',
  });
  return await db
    .collection('sitemaps')
    .doc(`${now}`)
    .set({ timestamp: now, urls });
};
