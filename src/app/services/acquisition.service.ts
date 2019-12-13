import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {Acquisition, AcquisitionGroup, Item, Price, Status} from '../models/acquisition';
import {GeneralService} from './general.service';
import {RestApiService} from './rest-api.service';
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

  constructor(private groupBy: GroupByPipe, public firebaseService: FirebaseService, public restApi: RestApiService) {
    super(firebaseService, restApi);
  }
  getAcquisition(acquisitionId: string) {
    this.acquisitionId = acquisitionId;
    this.restAPI.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc != null) {
        this.acquisition = doc as Acquisition;
        this.acquisition$.next(this.acquisition);
        if (this.acquisition.status === Status.DISTRIBUTION || this.acquisition.status === Status.DELIVERY) {
          this.distributions = this.createDistributions();
        }
      }
    });
    return this.acquisition$.asObservable();
  }

  saveOrUpdateAcquisition() {
   this.restAPI.addOrUpdate(this.acquisition).subscribe(a => {
     console.log('TODO: obraditi snimanje');
     });
  }

  deleteAcquisition() {
    return this.restAPI.deleteAcquisition(this.acquisitionId);
  }

  addAcquisition(acquisition: Acquisition): Observable<Acquisition> {
    return this.restAPI.addOrUpdate(acquisition);
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
        this.saveOrUpdateAcquisition();
        break;
      }
    }
  }

 getAcquisitionList() {
   return this.restAPI.getAcquisitionList();
 }

  createDeliverySheet(deliveriesArray, deliveryLocation) {
    return this.restAPI.createDeliverySheet(deliveriesArray, deliveryLocation);
  }
  createProcruimentSheet(id: string): Observable <Blob> {
    return this.restAPI.createProcruimentSheet(id);
  }
  createAcquisitionSheet(id: string): Observable <Blob> {
    return this.restAPI.createAcquisitionSheet(id);
  }
  createFinalReport(year): Observable <Blob> {
    return this.restAPI.createFinalReport(year);
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
