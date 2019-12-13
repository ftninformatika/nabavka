import { Injectable } from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Desideratum} from '../models/desideratum';
import {Observable, Subject, Subscription} from 'rxjs';
import {GeneralService} from './general.service';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DesideratumService extends GeneralService {

  constructor(public firebaseService: FirebaseService, public restAPI: RestApiService) {
    super(firebaseService, restAPI);
  }

  getDesiderataData() {
    return this.restAPI.getDesiderata();
  }

  addDesideratum(desideratum: Desideratum) {
    return this.restAPI.addOrUpdateDesideratum(desideratum);
  }

  deleteDesideratum(id: string) {
    return this.restAPI.deleteDesideratum(id);
  }

  updateDesideratum(item: Desideratum) {
    return this.restAPI.addOrUpdateDesideratum(item);
  }
}
