import * as admin from 'firebase-admin';
import * as firebaseAuth from 'firebase-admin/auth';
import { serviceAccount } from '@/configs/keys';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

export const storage = admin.storage();
export const db = admin.firestore();

export const auth = firebaseAuth;

export default admin;
