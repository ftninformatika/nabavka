import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Distributor} from '../models/distributor';
import {Offer} from '../models/offer';
import {Acquisition} from '../models/acquisition';
import {User} from '../models/user';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private firestore: AngularFirestore) {
  }

  addDesideratum(item: Desideratum) {
    return this.firestore.collection('Desiderata').add(item);
  }

  updateDesideratum(item: Desideratum): Observable<string> {
    const observable$ = new Subject<string>();
    const id = item.id;
    this.firestore.collection('Desiderata').doc(id).update(item).then(docRef => {
      this.firestore.collection('Desiderata').doc(id).update({id: firebase.firestore.FieldValue.delete()}).then( docR => {
        observable$.next();
      });
    });
    return observable$.asObservable();
  }

  deleteDesideratum(id: string) {
    return this.firestore.collection('Desiderata').doc(id).delete();
  }

  getDesiderataData() {
    return this.firestore.collection('Desiderata').snapshotChanges();
  }

  getDesiderataDataOnce() {
    return this.firestore.collection('Desiderata').get();
  }

  getSublocations() {
    return this.firestore.collection('Sublocation').snapshotChanges();
  }

  getLocations() {
    return this.firestore.collection('Location').snapshotChanges();
  }

  getAcquisitionListOnce() {
    return this.firestore.collection('Acquisition', ref => {
      return ref.orderBy('startDate', 'desc');
    }).get();
  }

  getAcquisitionOnce(id: string) {
    return this.firestore.collection('Acquisition').doc(id).get();
  }

  addAcquisition(acquisition: Acquisition) {
    return this.firestore.collection('Acquisition').add(acquisition);
  }

  updateAcquisition(id: string, acquisition: Acquisition) {
    this.firestore.collection('Acquisition').doc(id).update(acquisition);
  }

  deleteAcquisition(id: string) {
    return this.firestore.collection('Acquisition').doc(id).delete();
  }

}
