import { Injectable } from '@angular/core';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(public restAPI: RestApiService) {
  }
  getDistributor(pib: string) {
    return this.restAPI.getDistributor(pib);
  }
    addOffer(offer) {
      return this.restAPI.addOffer(offer);
  }
  getOffers(pib: string) {
    return this.restAPI.getOffers(pib);
  }

  createOfferSheet(id: string) {
    return this.restAPI.createOfferSheet(id);
  }
  }
