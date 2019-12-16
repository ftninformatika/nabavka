import { Injectable } from '@angular/core';
import {LocationCoder, Sublocation} from '../models/location_coder';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  sublocationList: Sublocation[] = [];
  locationList: LocationCoder[] = [];

  constructor(public restAPI: RestApiService) {
    this.restAPI.getSubLocations().subscribe(data => {
      this.sublocationList = data;
    });
    this.restAPI.getLocations().subscribe(data => {
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
