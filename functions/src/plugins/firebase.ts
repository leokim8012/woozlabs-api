import * as admin from 'firebase-admin';
import * as firebaseAuth from 'firebase-admin/auth';
import { serviceAccount } from '@/configs/keys';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const db = admin.firestore();

export const auth = firebaseAuth;

export default admin;
