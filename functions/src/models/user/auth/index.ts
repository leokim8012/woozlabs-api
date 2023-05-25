import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';
import crypto from 'crypto';
interface UserRoutineGroup {
  id: string;
  status: 'pending' | 'active' | 'disabled';
}
export class UserAuthDTO {
  constructor(
    readonly uid: string,
    readonly phoneNumber?: string,
    readonly disabled?: boolean,
    readonly email?: string,
    readonly emailVerified?: boolean,
    readonly providerData?: string[],
    readonly level?: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date // readonly visitedAt?: Date, // readonly deviceModel?: string, // readonly deviceName?: string, // readonly deviceOS?: string
  ) {}
}

export const converter: firestore.FirestoreDataConverter<UserAuthDTO> = {
  toFirestore: (model: UserAuthDTO, setOptions?: firestore.SetOptions) => {
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

    return {
      uid: model.uid,
      email: model.email,
      disabled: model.disabled || false,
      providerData: model.providerData || [],
      level: model.level || 3,
      phoneNumber: model.phoneNumber || '',
      emailVerified: model.emailVerified || false,
      createdAt: createdAt || firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: firestore.QueryDocumentSnapshot) => {
    const data = snapshot.data();

    return new UserAuthDTO(
      data.uid,
      data.phoneNumber,
      data.disabled,
      data.email,
      data.emailVerified,
      data.providerData,
      data.level,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  },
};

export default db.collection('users').withConverter(converter);
