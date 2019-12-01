import { Injectable } from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {LocationCoder, Sublocation} from '../models/location_coder';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  sublocationList: Sublocation[] = [];
  locationList: LocationCoder[];
  locationSubscription: Subscription;
  sublocationSubscription: Subscription;

  constructor(public firebaseService: FirebaseService) {
    this.sublocationSubscription = this.getSublocations().subscribe(data => {
      this.sublocationList = data;
    });
    this.locationSubscription = this.getLocations().subscribe(data => {
      this.locationList = data;
    });
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

  getSublocation(code: string) {
    const sublocation = this.sublocationList.find(x => x.code === code);
    if (sublocation) {
      return sublocation.code + ' - ' + sublocation.name;
    } else {
      return code;
    }
  }

  getSublocationList() {
    return this.sublocationList;
  }

  getLocation(code: string) {
    const location = this.locationList.find(x => x.code === code);
    if (location) {
      return location.code + ' - ' + location.name;
    } else {
      return code;
    }
  }
}
