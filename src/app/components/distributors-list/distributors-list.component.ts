import {Component, OnInit, ViewChild} from '@angular/core';
import {Distributor} from '../../models/distributor';
import {ModalDirective, ToastService} from 'ng-uikit-pro-standard';
import {CryptoUtils} from '../../utils/crypto.utils';
import {RestApiService} from '../../services/rest-api.service';
import {Store} from '@ngxs/store';
import {UserState} from '../../states/user.state';

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

  @ViewChild('addModal', {static: false})
  addModal: ModalDirective;

  @ViewChild('deleteDistributorModal', {static: false})
  deleteDistributorModal: ModalDirective;


  constructor(private toast: ToastService, private restApi: RestApiService, private store: Store) {
  }

  ngOnInit() {
    this.restApi.getDistributors().subscribe(data => {
      this.distributorsList = data as Distributor[];
    });
  }

  edit(rowIndex: number) {
    this.rowIndex = rowIndex;
  }

  add() {
    this.restApi.addUpdateDistributor(this.distributor).subscribe(data => {
      this.distributorsList = data as Distributor[];
    });
    this.addModal.hide();
    this.rowIndex = -1;
  }

  remove() {
    this.restApi.removeDistributor(this.selectedDistributor._id).subscribe(data => {
      this.distributorsList = data as Distributor[];
    });
    this.deleteDistributorModal.hide();
  }

  update(distributor: Distributor) {
    this.restApi.addUpdateDistributor(distributor).subscribe(data => {
      this.distributorsList = data as Distributor[];
    });
    this.rowIndex = -1;
  }
  confirmDelete(distributor: Distributor) {
    this.selectedDistributor = distributor;
    this.deleteDistributorModal.show();
  }

  getDistributerCryptoId(pib: string) {
    const library = this.store.selectSnapshot(UserState.getLibrary);
    return CryptoUtils.encryptData(library + ':' + pib);
  }

  getPermLink(pib: string) {
    return location.origin + '/offers/' + this.getDistributerCryptoId(pib);
  }

  linkCopied(link: string) {
    this.toast.info('Линк за унос понуда је копиран у привремену меморију. <hr> <a>' + link + '</a>', '', { enableHtml: true});
  }
}
