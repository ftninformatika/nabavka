import {Book} from './book';

export class Delivery {
  location?: string;
  books?: BookForDelivery[];
}
export  class BookForDelivery {
  book?: Book;
  amount?: number;

}
