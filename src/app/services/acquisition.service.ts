import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {Acquisition, AcquisitionGroup, Item, Price, Status} from '../models/acquisition';
import {GeneralService} from './general.service';
import {Distribution} from '../models/distribution';
import {GroupByPipe} from '../pipes/group-by.pipe';
import {Location} from '../models/location';
import {Desideratum} from '../models/desideratum';

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService extends GeneralService {

  private acquisition$ = new Subject<Acquisition>();
  acquisitionId: string;
  acquisition: Acquisition = {};
  private selectedItem: Item;
  distributions: Distribution[];
  distributionLocations = new Subject<Desideratum>();
  distributionLocations$ = this.distributionLocations.asObservable();

  constructor(private groupBy: GroupByPipe, public firebaseService: FirebaseService) {
    super(firebaseService);
  }

  getAcquisition(acquisitionId: string) {
    this.acquisitionId = acquisitionId;
    this.firebaseService.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc.exists) {
        this.acquisition = doc.data() as Acquisition;
        this.acquisition$.next(this.acquisition);
        if (this.acquisition.status === Status.DISTRIBUTION || this.acquisition.status === Status.DELIVERY) {
          this.distributions = this.createDistributions();
        }
      }
    });
    return this.acquisition$.asObservable();
  }

  saveAcquisition() {
    this.firebaseService.updateAcquisition(this.acquisitionId, this.acquisition);
  }

  deleteAcquisition(): Observable<string> {
    const observable$ = new Subject<string>();
    this.firebaseService.deleteAcquisition(this.acquisitionId).then(docRef => {
      observable$.next();
    });
    return observable$.asObservable();
  }

  addAcquisition(acquisition: Acquisition): Observable<string> {
    const acquisitionId$ = new Subject<string>();
    this.firebaseService.addAcquisition(acquisition).then(docRef => {
      acquisitionId$.next(docRef.id);
    });
    return acquisitionId$.asObservable();
  }

  getOtherAcquisitionGroups(group: AcquisitionGroup) {
    const list = [];
    this.acquisition.acquisitionGroups.forEach(g => {
      if (g.title !== group.title) {
        list.push(g.title);
      }
    });
    return list;
  }

  moveItemToGroup(item: Item, groupname: string) {
    for (const group of this.acquisition.acquisitionGroups) {
      if (group.title === groupname) {
        group.items.push(item);
        this.saveAcquisition();
        break;
      }
    }
  }

  getAcquisitionList() {
    const acquisitionList$ = new Subject<Acquisition[]>();
    this.firebaseService.getAcquisitionListOnce().subscribe(data => {
      const acquisitionList = data.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as Acquisition;
      });
      acquisitionList$.next(acquisitionList);
    });
    return acquisitionList$.asObservable();
  }

  setSelectedItem(selectedItem: Item) {
      this.selectedItem = selectedItem;
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  isbnNotExists(isbn: string) {
    for (const group of this.acquisition.acquisitionGroups) {
      for (const item of group.items) {
        if (item !== this.selectedItem && item.desideratum.isbn === isbn) {
          return false;
        }
      }
    }
    return true;
  }

  calculatePriceWithoutVAT(price: Price) {
    return (price.price - ((price.rebate / 100) * price.price));
  }

  calculatePriceWithVAT(price: Price) {
    const priceWithoutVAT = this.calculatePriceWithoutVAT(price);
    return (priceWithoutVAT + ((price.vat / 100) * priceWithoutVAT));
  }

  createDistributions(): Distribution[] {
    const distributions: Distribution[] = [];
    if (this.acquisition) {
      this.acquisition.acquisitionGroups.forEach(group => {
        if (group.items) {
          group.items.forEach(item => {
            const locationGroups = this.groupBy.transform(item.desideratum.locations, 'location');
            if (locationGroups) {
              locationGroups.forEach(locationGroup => {
                let distribution = distributions.find(x => x.location === locationGroup.key);
                if (!distribution) {
                  distribution = new Distribution();
                  distribution.location = locationGroup.key;
                  distribution.acquisitionGroup = [];
                  distributions.push(distribution);
                }
                let newGroup = distribution.acquisitionGroup.find(x => x.title === group.title);
                if (!newGroup) {
                  newGroup = {...group};
                  distribution.acquisitionGroup.push(newGroup);
                  newGroup.items = [];
                }
                const newItem: Item = {... item, desideratum: {...item.desideratum}};
                newGroup.items.push(newItem);
                newItem.desideratum.locations = [];
                newItem.desideratum.locations = locationGroup.value;
              });
            }
          });
        }
      });
    }
    return distributions;
  }

  getDistributions() {
    if (!this.distributions) {
      this.distributions = this.createDistributions();
    }
    return this.distributions;
  }

  setDistributionLocations(desideratum: Desideratum) {
    this.distributionLocations.next(desideratum);
  }

  addNewLocation(isbn: string, location: Location) {
    let desideratum: Desideratum;
    this.acquisition.acquisitionGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.desideratum.isbn === isbn) {
          desideratum = item.desideratum;
        }
      });
    });
    desideratum.locations.push(location);
  }

  deleteLocation(isbn: string, location: Location) {
    for (const group of this.acquisition.acquisitionGroups) {
      const item = group.items.find(x => x.desideratum.isbn === isbn);
      if (item) {
        const locationIndex = item.desideratum.locations.findIndex(x => x === location);
        if (locationIndex !== -1) {
          item.desideratum.locations.splice(locationIndex, 1);
          return;
        }
      }
    }
  }

}
