import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Desideratum} from '../models/desideratum';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  items: AngularFirestoreCollection<Desideratum>;

  constructor(private db: AngularFirestore) {
    this.items = db.collection<Desideratum>('Desiderata');
  }

  addItem(item: any) {
    this.items.add(item);
  }

  getData() {
    return this.items;
  }
}
