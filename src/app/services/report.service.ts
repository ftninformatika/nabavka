import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(public restAPI: RestApiService) { }

  createFinalReport(year): Observable <Blob> {
    return this.restAPI.createFinalReport(year);
  }
}
