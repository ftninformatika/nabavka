import {Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Distributor} from '../../models/distributor';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {Offer} from '../../models/offer';

@Component({
  selector: 'app-distributers-list',
  templateUrl: './distributors-list.component.html',
  styleUrls: ['./distributors-list.component.scss']
})
export class DistributorsListComponent implements OnInit {
  distributorsList: Distributor[];
  distributor: Distributor = {};
  rowIndex: number;
  @ViewChild(ModalDirective, {static: false})
  modal: ModalDirective;

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.firebaseService.getDistributors().subscribe(data => {
      this.distributorsList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Distributor;
      });
  });

  }
  edit(rowIndex: number) {
    this.rowIndex = rowIndex;
  }
  add() {
    this.firebaseService.addDistributor(this.distributor);
    const offer: Offer = {};
    offer.distributer = this.distributor.pib;
    offer.permalink = 'neki permlink';
    this.firebaseService.addOffer(offer);
    this.modal.hide();
  }
  remove(distributor: Distributor) {
    this.firebaseService.removeDistributor(distributor.id);
  }
  update(distributor: Distributor) {
    this.firebaseService.updateDistributor(distributor);
    this.rowIndex = -1;
  }
  addNewDistributor() {
    this.modal.show();
  }
}
