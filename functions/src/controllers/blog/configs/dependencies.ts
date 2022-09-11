import { Container } from 'inversify';
import TYPES from '@/controllers/blog/configs/types';

import { ArticleController } from '@/controllers/blog/contents/articles';
import { RegistrableController } from '@/controllers/RegistrableController';
import {
  ArticleService,
  ArticleServiceImpl,
} from '@/services/blog/contents/articles';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(ArticleController);
container.bind<ArticleService>(TYPES.ArticleService).to(ArticleServiceImpl);
// container
//   .bind<AddressRepository>(TYPES.AddressRepository)
//   .to(AddressRepositoryImplMongo);

export default container;
