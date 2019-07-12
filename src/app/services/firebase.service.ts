import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';
import * as firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  items: AngularFirestoreCollection<Desideratum>;

  constructor(private firestore: AngularFirestore) {
  }

  addItem(item: Desideratum) {
    return this.firestore.collection('Desiderata').add(item);
  }

  updateItem(item: Desideratum) {
    const id = item.id;
    this.firestore.collection('Desiderata').doc(id).update(item);
    this.firestore.collection('Desiderata').doc(id).update({id: firebase.firestore.FieldValue.delete()});
  }

  deleteItem(id: string) {
    this.firestore.collection('Desiderata').doc(id).delete();
  }

  getData() {
    return this.firestore.collection('Desiderata').snapshotChanges();
  }
}
