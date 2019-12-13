import { Location } from './location';

export class Desideratum {
  // tslint:disable-next-line:variable-name
  _id?: string;
  isbn?: string;
  author?: string;
  title?: string;
  publisher?: string;
  locations?: Location[];
}
