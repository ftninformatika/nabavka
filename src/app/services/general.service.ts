import { Injectable } from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {LocationCoder, Sublocation} from '../models/location_coder';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  sublocationList: Sublocation[] = [];
  locationList: LocationCoder[];
  locationSubscription: Subscription;
  sublocationSubscription: Subscription;

  constructor(public firebaseService: FirebaseService, public restAPI: RestApiService) {
    this.sublocationSubscription = this.getSublocations().subscribe(data => {
      this.sublocationList = data;
    });
    this.locationSubscription = this.getLocations().subscribe(data => {
      this.locationList = data;
    });
  }

  getSublocations() {
    return this.restAPI.getSubLocations();
  }
  getLocations() {
    return this.restAPI.getLocations();
  }

  getSublocation(code: string) {
    const sublocation = this.sublocationList.find(x => x.coder_id === code);
    if (sublocation) {
      return sublocation.coder_id + ' - ' + sublocation.description;
    } else {
      return code;
    }
  }

  getSublocationList() {
    return this.sublocationList;
  }

  getLocation(code: string) {
    const location = this.locationList.find(x => x.coder_id === code);
    if (location) {
      return location.coder_id + ' - ' + location.description;
    } else {
      return code;
    }
  }
}
