import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Delivery} from '../models/delivery';
import {environment} from '../../environments/environment';
import {Acquisition} from '../models/acquisition';
import {Distributor} from '../models/distributor';
import {Offer} from '../models/offer';
import {Desideratum} from '../models/desideratum';
import {Observable} from 'rxjs';
import {LocationCoder, Sublocation} from '../models/location_coder';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {

  constructor(private httpClient: HttpClient) {
  }

  public login(username: string, password: string) {
    const data = {username, password};
    return this.httpClient.post(environment.baseUrl + '/auth', data);

  }

// acqusition
  public getAcquisition(acquisitionId) {
    return this.httpClient.get(environment.baseUrl + '/acquisition/' + acquisitionId);
  }

  public getAcquisitionList() {
    return this.httpClient.get(environment.baseUrl + '/acquisition/getAll');
  }

  public addOrUpdate(acquisition: Acquisition) {
    return this.httpClient.post(environment.baseUrl + '/acquisition/addOrUpdate', acquisition);
  }

  public deleteAcquisition(acquisitionId) {
    return this.httpClient.delete(environment.baseUrl + '/acquisition/' + acquisitionId);
  }

  public getLastAcquisitionForDistribution() {
    return this.httpClient.get(environment.baseUrl + '/acquisition/getLast');
  }

  // deziderati
  public getDesideratum(desideratumId) {
    return this.httpClient.get(environment.baseUrl + '/desideratum/' + desideratumId);
  }

  public getDesiderata(): Observable<Desideratum[]> {
    return this.httpClient.get<Desideratum[]>(environment.baseUrl + '/desideratum/getAll');
  }

  public addOrUpdateDesideratum(desideratum: Desideratum) {
    return this.httpClient.post(environment.baseUrl + '/desideratum/addOrUpdate', desideratum);
  }

  public deleteDesideratum(desideratumId) {
    return this.httpClient.delete(environment.baseUrl + '/desideratum/' + desideratumId);
  }

  // location
  public getLocations(): Observable<LocationCoder[]> {
    return this.httpClient.get <LocationCoder[]>(environment.baseUrl + '/location/getAll');
  }

  public getSubLocations(): Observable<Sublocation[]> {
    return this.httpClient.get <Sublocation[]>(environment.baseUrl + '/location/getAllSublocation');
  }

  // reports

  public createDeliverySheet(deliveries: Delivery[], deliveryLocation) {
    const data = {deliveryList: deliveries, title: deliveryLocation};
    return this.httpClient.post(environment.baseUrl + '/reports/createDeliverySheet', data, {responseType: 'blob' as 'blob'});

  }

  createAcquisitionSheet(id: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(environment.baseUrl + '/reports/createAcquisitionSheet/' + id, {responseType: 'blob' as 'blob'});

  }

  createProcruimentSheet(id: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(environment.baseUrl + '/reports/createProcruimentSheetXLS/' + id, {responseType: 'blob' as 'blob'});

  }

  createFinalReport(year: number) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(environment.baseUrl + '/reports/createFinalReport/' + year, {responseType: 'blob' as 'blob'});

  }

  createOfferSheet(idOffer: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(environment.baseUrl + '/reports/createOfferSheet/' + idOffer, {responseType: 'blob' as 'blob'});

  }

  // distributors

  getDistributors() {
    return this.httpClient.get(environment.baseUrl + '/distributors/getAll');
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
    return this.httpClient.get <Offer>(environment.baseUrl + '/distributors/getOffersByPib/' + pib);
  }
}
