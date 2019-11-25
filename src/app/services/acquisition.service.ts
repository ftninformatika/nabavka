import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {Acquisition, AcquisitionGroup, Item} from '../models/acquisition';
import {GeneralService} from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService extends GeneralService {

  private acquisition$ = new Subject<Acquisition>();
  acquisitionId: string;
  acquisition: Acquisition = {};
  private selectedItem: Item;

  constructor(public firebaseService: FirebaseService) {
    super(firebaseService);
  }

  getAcquisition(acquisitionId: string) {
    this.acquisitionId = acquisitionId;
    this.firebaseService.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc.exists) {
        this.acquisition = doc.data() as Acquisition;
        this.acquisition$.next(this.acquisition);
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

}
