import { initDB } from 'react-indexed-db';
import { DBConfig } from './modal';

export const initDatabase = () => {
  initDB(DBConfig);
};
