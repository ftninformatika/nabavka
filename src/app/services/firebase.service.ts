import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Distributer} from '../models/distributer';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private firestore: AngularFirestore) {
  }

  addDesideratum(item: Desideratum) {
    return this.firestore.collection('Desiderata').add(item);
  }

  updateDesideratum(item: Desideratum) {
    const id = item.id;
    this.firestore.collection('Desiderata').doc(id).update(item);
    this.firestore.collection('Desiderata').doc(id).update({id: firebase.firestore.FieldValue.delete()});
  }

  deleteDesideratum(id: string) {
    this.firestore.collection('Desiderata').doc(id).delete();
  }

  getDesiderataData() {
    return this.firestore.collection('Desiderata').snapshotChanges();
  }

  getDistributers() {
    return this.firestore.collection('Distributer').snapshotChanges();
  }
  updateDistributer(distributer: Distributer) {
      this.firestore.collection('Distributer').doc(distributer.id).update(distributer);
      this.firestore.collection('Distributer').doc(distributer.id).update({id: firebase.firestore.FieldValue.delete()});
  }
  removeDistributer(id: string) {
    this.firestore.collection('Distributer').doc(id).delete();
  }
  addDistributer(item: Distributer) {
    return this.firestore.collection('Distributer').add(item);
  }
}
