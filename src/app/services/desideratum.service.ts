import { Injectable } from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Desideratum} from '../models/desideratum';
import {Observable, Subject} from 'rxjs';
import {GeneralService} from './general.service';

@Injectable({
  providedIn: 'root'
})
export class DesideratumService extends GeneralService {

  constructor(public firebaseService: FirebaseService) {
    super(firebaseService);
  }

  getDesiderataData(): Observable<Desideratum[]> {
    const desiderataList$ = new Subject<Desideratum[]>();
    this.firebaseService.getDesiderataDataOnce().subscribe(data => {
      const desiderataList = data.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as Desideratum;
      });
      desiderataList$.next(desiderataList);
    });
    return desiderataList$.asObservable();
  }

  addDesideratum(desideratum: Desideratum): Observable<string> {
    const desideratumId$ = new Subject<string>();
    this.firebaseService.addDesideratum(desideratum).then(docRef => {
      desideratumId$.next(docRef.id);
    });
    return desideratumId$.asObservable();
  }

  deleteDesideratum(id: string) {
    const observable$ = new Subject<string>();
    this.firebaseService.deleteDesideratum(id).then(docRef => {
      observable$.next();
    });
    return observable$.asObservable();
  }

  updateDesideratum(item: Desideratum) {
    const observable$ = new Subject<string>();
    this.firebaseService.updateDesideratum(item).subscribe(data => {
      observable$.next();
    });
    return observable$.asObservable();
  }
}
