import admin from '@/plugins/firebase';

export interface RepositoryOptions {
  limit: number;
  order: string;
  sort: 'desc' | 'asc';
  offset?: number;
  where: {
    path: string;
    operator: admin.firestore.WhereFilterOp;
    value: string;
  };
}
