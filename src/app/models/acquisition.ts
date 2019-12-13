import {Desideratum} from './desideratum';

export class Acquisition {
  // tslint:disable-next-line:variable-name
  _id?: string;
  title?: string;
  startDate?: Date;
  acquisitionDate?: Date;
  budget?: number;
  status?: Status;
  desiderataUpdated?: boolean;
  acquisitionGroups?: AcquisitionGroup[];
  deliveries?: Delivery[];
}

export class AcquisitionGroup {
  title: string;
  distributor?: string;
  items?: Item[];
}

export class Item {
  desideratum?: Desideratum;
  planedPrice?: Price;
  realPrice?: Price;
}

export class Price {
  price?: number;
  rebate?: number;
  vat?: number;
}

export enum Status {
  OPEN = 'open',
  CLOSED = 'closed',
  DISTRIBUTION = 'distribution',
  DELIVERY = 'delivery'
}

export class Delivery {
  title?: string;
  createDate?: Date;
  acquisitionGroups?: string[];
}
