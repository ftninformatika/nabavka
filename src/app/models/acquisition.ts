import {Desideratum} from './desideratum';

export class Acquisition {
  id?: string;
  year?: string;
  num?: string;
  startDate?: Date;
  budget?: number;
  status?: Status;
  desiderataUpdated?: boolean;
  acquisitionGroups?: AcquisitionGroup[];
}

export class AcquisitionGroup {
  title: string;
  distributor?: string;
  items?: Item[];
}

export class Item {
  desideratum: Desideratum;
  planedPrice: Price;
  realPrice?: Price;
}

export class Price {
  price: number;
  rebate: number;
  vat: number;
}

export enum Status {
  OPEN = 'open',
  CLOSED = 'closed',
  DELIVERY = 'delivery'
}
