import devServiceAccount from './devKey.json';
import prodServiceAccount from './prodKey.json';

export const serviceAccount =
  process.env.node_env === 'production'
    ? prodServiceAccount
    : devServiceAccount;
