import {Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Distributor} from '../../models/distributor';
import {ModalDirective, ToastService} from 'ng-uikit-pro-standard';
import {Offer} from '../../models/offer';
import {CryptoUtils} from '../../utils/crypto.utils';

@Component({
  selector: 'app-distributers-list',
  templateUrl: './distributors-list.component.html',
  styleUrls: ['./distributors-list.component.scss']
})
export class DistributorsListComponent implements OnInit {
  distributorsList: Distributor[];
  distributor: Distributor = {};
  selectedDistributor: Distributor = {};
  rowIndex: number;
  distributorLink;
  @ViewChild('addModal', {static: false})
  addModal: ModalDirective;

  @ViewChild('deleteDistributorModal', {static: false})
  deleteDistributorModal: ModalDirective;


  constructor(private firebaseService: FirebaseService, private toast: ToastService) {
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
    this.firebaseService.addOffer(offer);
    this.addModal.hide();
  }
  remove() {
    this.firebaseService.removeDistributor(this.selectedDistributor.id);
    this.deleteDistributorModal.hide();
  }
  update(distributor: Distributor) {
    this.firebaseService.updateDistributor(distributor);
    this.rowIndex = -1;
  }
  confirmDelete(distributor: Distributor) {
    this.selectedDistributor = distributor;
    this.deleteDistributorModal.show();
  }

  getDistributerCryptoId(pib: string) {
    return CryptoUtils.encryptData(pib);
  }

  getPermLink(pib: string) {
    return location.origin + '/offers/' + CryptoUtils.encryptData(pib);
  }

  linkCopied(link: string) {
    this.toast.info('Линк за унос понуда је копиран у привремену меморију. <hr> <a>' + link + '</a>', '', { enableHtml: true});
  }
}