import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Distributor} from '../models/distributor';
import {Offer} from '../models/offer';
import {Acquisition} from '../models/acquisition';
import {User} from '../models/user';

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
  getDistributors() {
    return this.firestore.collection('Distributor').snapshotChanges();
  }
  updateDistributor(distributor: Distributor) {
      this.firestore.collection('Distributor').doc(distributor.id).update(distributor);
      this.firestore.collection('Distributor').doc(distributor.id).update({id: firebase.firestore.FieldValue.delete()});
  }
  removeDistributor(id: string) {
    this.firestore.collection('Distributor').doc(id).delete();
   /// todo dodati da se kaskadno obrisu ponude ovog dobavljaca
  }
  addDistributor(item: Distributor) {
    return this.firestore.collection('Distributor').add(item);
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
  getDistributor(pib: string) {
    return this.firestore.collection('Distributor', ref =>
      ref.where('pib', '==', pib)).snapshotChanges();
  }

  getUser(username: string, password: string) {
    return this.firestore.collection('User', ref =>
      ref.where('username', '==', username)).get();
  }

}
