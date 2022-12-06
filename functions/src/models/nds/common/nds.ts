import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';
import crypto from 'crypto';

export class NDSDTO {
  constructor(
    readonly id: string,
    readonly uid: string,
    readonly gameId: string,
    readonly dataPath: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

export const converter: firestore.FirestoreDataConverter<NDSDTO> = {
  toFirestore: (model: NDSDTO, setOptions?: firestore.SetOptions) => {
    if (setOptions?.merge) {
      return Object.assign(model, {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    const createdAt =
      typeof model.createdAt === 'string'
        ? new Date(model.createdAt)
        : model.createdAt;
    const updatedAt =
      typeof model.updatedAt === 'string'
        ? new Date(model.updatedAt)
        : model.updatedAt;

    const result = {
      id: model.id,
      uid: model.uid,
      gameId: model.gameId,
      dataPath: model.dataPath,
      createdAt: createdAt || firestore.FieldValue.serverTimestamp(),
      updatedAt: updatedAt || firestore.FieldValue.serverTimestamp(),
    };
    return result;
  },
  fromFirestore: (snapshot: firestore.QueryDocumentSnapshot): NDSDTO => {
    const data = snapshot.data();

    return new NDSDTO(
      data.id,
      data.uid,
      data.gameId,
      data.dataPath,
      data.createdAt?.toDate(),
      data.updatedAt?.toDate()
    );
  },
};

export default db.collection('nds').withConverter(converter);
