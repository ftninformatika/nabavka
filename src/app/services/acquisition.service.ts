import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {Acquisition, AcquisitionGroup, Item} from '../models/acquisition';
import {Sublocation, LocationCoder} from '../models/location_coder';

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {

  private acquisition$ = new Subject<Acquisition>();
  acquisitionId: string;
  acquisition: Acquisition = {};

  constructor(private firebaseService: FirebaseService) { }

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

  getSublocations(): Observable<Sublocation[]> {
    const sublocations$ = new Subject<Sublocation[]>();
    this.firebaseService.getSublocations().subscribe(data => {
      const sublocationList: Sublocation[] = data.map(e => {
        return e.payload.doc.data() as Sublocation;
      });
      sublocations$.next(sublocationList);
    });
    return sublocations$.asObservable();
  }

  getLocations(): Observable<LocationCoder[]> {
    const locations$ = new Subject<LocationCoder[]>();
    this.firebaseService.getLocations().subscribe(data => {
      const locationList: LocationCoder[] = data.map(e => {
        return e.payload.doc.data() as LocationCoder;
      });
      locations$.next(locationList);
    });
    return locations$.asObservable();
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

}
