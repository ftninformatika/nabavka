import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Delivery} from '../models/delivery';
import {environment} from '../../environments/environment';
import {Acquisition} from '../models/acquisition';
import {Distributor} from '../models/distributor';
import {Offer} from '../models/offer';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {


  constructor(private httpClient: HttpClient) { }

  public login(username: string, password: string){
    const data = {username, password};
    return this.httpClient.post(environment.baseUrl + '/auth', data);

  }

  // reports

  public createDeliverySheet(deliveries: Delivery[], acquisitionTitle, acquisitionGroup) {
    const data = {deliveryList: deliveries, title: acquisitionTitle, group: acquisitionGroup};
    const option = { responseType: 'blob' as 'blob'}
    return this.httpClient.post(environment.baseUrl + '/reports/createDeliverySheet', data, {...option} );

  }

  createAcquisitionSheet(acquisition: Acquisition) {
    return this.httpClient.post(environment.baseUrl + '/reports/createAcquisitionSheetFinal', acquisition, {responseType: 'blob' as 'blob'});

  }

  // distributors

  getDistributors() {
    return this.httpClient.get(environment.baseUrl + '/distributors/getAll' );
  }

  getDistributor(pib: string) {
    return this.httpClient.get(environment.baseUrl + '/distributors/get/' + pib);
  }

  addUpdateDistributor(d: Distributor) {
    return this.httpClient.post(environment.baseUrl + '/distributors/addUpdate', d);

  }

  removeDistributor(id: string) {
    return this.httpClient.post(environment.baseUrl + '/distributors/remove', id);

  }

  addOffer(item: Offer) {
    return this.httpClient.post<Offer>(environment.baseUrl + '/distributors/addOffer', item);
  }

  getOffers(pib: string) {
    return this.httpClient.get <Offer>(environment.baseUrl + '/distributors/getOffersByPib/' + pib );
  }
}
