import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';
import crypto from 'crypto';

export class BlogArticle {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly emailVerified: boolean,
    readonly providerData?: string[],
    readonly displayName?: string,
    readonly photoURL?: string,
    readonly level?: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date,
    readonly visitedAt?: Date,
    readonly deviceModel?: string,
    readonly deviceName?: string,
    readonly deviceOS?: string
  ) {}
}

export const converter: firestore.FirestoreDataConverter<UserAuthentication> = {
  toFirestore: (
    model: UserAuthentication,
    setOptions?: firestore.SetOptions
  ) => {
    if (setOptions?.merge) {
      return Object.assign(model, {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    const hash = crypto.createHash('md5').update(model.email).digest('hex');
    return {
      email: model.email,
      providerData: model.providerData || [],
      displayName: model.displayName || '',
      level: model.level || 3,
      photoURL: model.photoURL || `https://www.gravatar.com/avatar/${hash}.jpg`,
      createdAt: model.createdAt || firestore.FieldValue.serverTimestamp(),
      updatedAt: model.updatedAt || firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data();

    let photoURL = data.photoURL || '';
    if (photoURL.includes('gravatar')) photoURL += '?d=identicon';
    return new UserAuthentication(
      data.email,
      data.providerData,
      data.displayName,
      data.level,
      photoURL,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  },
};

export default db.collection('users').withConverter(converter);
