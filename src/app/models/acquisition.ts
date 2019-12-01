import {Desideratum} from './desideratum';

export class Acquisition {
  id?: string;
  title?: string;
  startDate?: Date;
  acquisitionDate?: Date;
  budget?: number;
  status?: Status;
  desiderataUpdated?: boolean;
  acquisitionGroups?: AcquisitionGroup[];
}

export class AcquisitionGroup {
  title: string;
  distributor?: string;
  items?: Item[];
  deliveryLocations?: DeliveryLocation[];
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

export class DeliveryLocation {
  location: string;
  desideratum: Desideratum;
  price?: Price;
}
