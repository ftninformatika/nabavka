import { Injectable } from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Observable, Subject} from 'rxjs';
import {LocationCoder, Sublocation} from '../models/location_coder';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public firebaseService: FirebaseService) { }

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
}
