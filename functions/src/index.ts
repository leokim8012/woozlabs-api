require('module-alias/register');
import * as functions from 'firebase-functions';
import userCollection, { UserAuthentication } from '@/models/auth/users';
import { auth } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';

exports.blog = functions.https.onRequest(require('@/controllers/blog'));

export const createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, providerData, displayName, photoURL, emailVerified } =
    user;

  const claims = { level: 3 };

  // if (functions.config().admin.email === user.email && user.emailVerified) {
  //   claims.level = 0;
  // }

  await auth.getAuth().setCustomUserClaims(uid, claims);

  const ref = userCollection.doc(uid);

  if (!email) throw Error(statusCode.BAD_REQUEST);

  const userData = new UserAuthentication(
    uid,
    email,
    emailVerified,
    providerData.map((p) => p.providerId),
    displayName,
    photoURL,
    claims.level
  );

  console.log(userData);
  const r = await ref.set(userData);

  return r;
});

export const deleteUser = functions.auth.user().onDelete((user) => {
  const ref = userCollection.doc(user.uid);
  return ref.delete();
});
