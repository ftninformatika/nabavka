import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Distributer} from '../models/distributer';
import {Offer} from '../models/offer';


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

  getSublocations() {
    return this.firestore.collection('Sublocation').snapshotChanges();
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
  addOffer(item: Offer) {
    return this.firestore.collection('Offer').add(item);
  }
  updateOffer(item: Offer) {
    this.firestore.collection('Offer').doc(item.id).update(item);
    this.firestore.collection('Offer').doc(item.id).update({id: firebase.firestore.FieldValue.delete()});

  }
  removeOffer(id: string) {
    this.firestore.collection('Offer').doc(id).delete();
  }
  getOffers(pib: string) {
    return this.firestore.collection('Offer', ref =>
      ref.where('distributer', '==', pib)).snapshotChanges();
  }
  getDistributer(pib: string) {
    return this.firestore.collection('Distributer', ref =>
      ref.where('pib', '==', pib)).snapshotChanges();
  }

}
