import { db } from '@/plugins/firebase';
import firestore from '@google-cloud/firestore';
import crypto from 'crypto';

export class BlogArticleDTO {
  constructor(
    readonly id: string,
    readonly category: string,
    readonly imageURL: string,
    readonly filePath: string,
    readonly author: string,
    readonly title: string,
    readonly subtitle: string,
    readonly views: number,
    readonly notionUrl: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

export const converter: firestore.FirestoreDataConverter<BlogArticleDTO> = {
  toFirestore: (model: BlogArticleDTO, setOptions?: firestore.SetOptions) => {
    if (setOptions?.merge) {
      return Object.assign(model, {
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    return {
      id: model.id,
      category: model.category,
      author: model.author,
      filePath: model.filePath,
      imageURL: model.imageURL,
      notionUrl: model.notionUrl,
      title: model.title,
      subtitle: model.subtitle,
      views: model.views || 0,
      createdAt: model.createdAt || firestore.FieldValue.serverTimestamp(),
      updatedAt: model.updatedAt || firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore: (
    snapshot: firestore.QueryDocumentSnapshot
  ): BlogArticleDTO => {
    const data = snapshot.data();

    return new BlogArticleDTO(
      data.id,
      data.category,
      data.imageURL,
      data.filePath,
      data.author,
      data.title,
      data.subtitle,
      data.views,
      data.notionUrl,
      data.createdAt.toDate(),
      data.updatedAt.toDate()
    );
  },
};

export default db.collection('articles').withConverter(converter);
