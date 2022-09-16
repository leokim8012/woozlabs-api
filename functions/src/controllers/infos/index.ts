/* eslint-disable require-jsdoc */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */

import admin, { db } from '@/plugins/firebase';
import * as functions from 'firebase-functions';

// User Count
db.collection('infos')
  .doc('user')
  .get()
  .then((s) => {
    if (!s.exists) db.collection('infos').doc('user').set({ total: 0 });
  });
exports.incrementUserCount = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    return db
      .collection('infos')
      .doc('user')
      .update('totalCount', admin.firestore.FieldValue.increment(1));
  });
exports.decrementUserCount = functions.firestore
  .document('users/{userID}')
  .onDelete((snap, context) => {
    return db
      .collection('infos')
      .doc('user')
      .update('totalCount', admin.firestore.FieldValue.increment(-1));
  });

// Playroom Count
db.collection('infos')
  .doc('articles')
  .get()
  .then((s) => {
    if (!s.exists) {
      db.collection('infos').doc('articles').set({ totalCount: 0 });
    }
  });
exports.incrementArticleCount = functions.firestore
  .document('articles/{articleId}')
  .onCreate(async (snap, context) => {
    if (snap.data().category) {
      try {
        await db
          .collection('infos')
          .doc('articles')
          .collection('categories')
          .doc((snap.data().category as String).toLowerCase())
          .update('totalCount', admin.firestore.FieldValue.increment(1));
        await db
          .collection('infos')
          .doc('articles')
          .update('totalCount', admin.firestore.FieldValue.increment(1));
      } catch (e) {
        console.log(e);
      }
    }
  });

exports.decrementArticleCount = functions.firestore
  .document('articles/{articleId}')
  .onDelete(async (snap, context) => {
    if (snap.data().category) {
      try {
        await db
          .collection('infos')
          .doc('articles')
          .collection('categories')
          .doc((snap.data().category as String).toLowerCase())
          .update('totalCount', admin.firestore.FieldValue.increment(-1));
        await db
          .collection('infos')
          .doc('articles')
          .update('totalCount', admin.firestore.FieldValue.increment(-1));
      } catch (e) {
        console.log(e);
      }
    }
  });
