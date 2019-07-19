import {Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../../services/firebase.service';
import {Distributer} from '../../../models/distributer';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {Offer} from '../../../models/offer';

@Component({
  selector: 'app-distributers-list',
  templateUrl: './distributers-list.component.html',
  styleUrls: ['./distributers-list.component.scss']
})
export class DistributersListComponent implements OnInit {
  distributersList: Distributer[];
  distributer: Distributer = {};
  rowIndex: number;
  @ViewChild(ModalDirective, {static: false})
  modal: ModalDirective;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.firebaseService.getDistributers().subscribe(data => {
      this.distributersList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        } as Distributer;
      });
  });

  }
  edit(rowIndex: number) {
    this.rowIndex = rowIndex;
  }
  add() {
    this.firebaseService.addDistributer(this.distributer);
    const offer: Offer = {};
    offer.distributer = this.distributer.pib;
    offer.permalink = 'neki permlink';
    this.firebaseService.addOffer(offer);
    this.modal.hide();
  }
  remove(distributer: Distributer) {
    this.firebaseService.removeDistributer(distributer.id);
  }
  update(distributer: Distributer) {
    this.firebaseService.updateDistributer(distributer);
    this.rowIndex = -1;
  }
  addNewDistributer() {
    this.modal.show();
  }
}
