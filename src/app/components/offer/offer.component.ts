import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Offer} from '../../models/offer';
import {Book} from '../../models/book';
import {MdbTableDirective, ModalDirective, ToastService} from 'ng-uikit-pro-standard';
import {ActivatedRoute} from '@angular/router';
import {Distributor} from '../../models/distributor';
import {CryptoUtils} from '../../utils/crypto.utils';
import {Roles} from '../../configs/app.config';
import {DistributorSetupAction, LogoutAction, UserState} from '../../states/user.state';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {User} from '../../models/user';
import {OfferService} from '../../services/offer.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  offerList: Offer;
  book: Book = {};
  offeredBooks: Book[] ;
  rowIndex: number;
  pib: string;
  message = '';
  @ViewChild('addModal', {static: false})
  addModal: ModalDirective;
  @ViewChild('modalDeleteOffer', {static: false})
  modalDeleteOffer: ModalDirective;
  distributer: Distributor;
  isDistributer = false;
  searchText: string;
  previous: string;

  @ViewChild(MdbTableDirective, { static: true })
  mdbTable: MdbTableDirective;
  // tslint:disable-next-line:max-line-length
  constructor(private offerService: OfferService, private route: ActivatedRoute, private toast: ToastService, private store: Store) { }

  @HostListener('input') oninput() {
    this.searchItems();
  }
  ngOnInit() {
    const encryptedLink = this.route.snapshot.paramMap.get('pib');
    const permlink = CryptoUtils.decryptData(encryptedLink);
    if (permlink != null) {
      this.pib = permlink.substring(permlink.indexOf(':') + 1);
      // ovo znaci da je na stranicu prvi put dosao distributor i to cemo sacuvati u stanju
      if (this.store.selectSnapshot(UserState.getLibrary) == null) {
        this.store.dispatch(new DistributorSetupAction(permlink.substring(0, permlink.indexOf(':')), Roles.DISTRIBUTOR));
      }
      // ako refresuje stranicu proverimo samo da li je vec bio ranije i da li je distributor ili bibliotekar
      if (this.store.selectSnapshot(UserState.getRole) === Roles.DISTRIBUTOR) {
        this.isDistributer = true;
      }
      this.offerService.getDistributor(this.pib).subscribe(dist => {
        this.distributer = dist;
        if (this.distributer == null ) {
          this.message = 'Не постоји понуда.';
          this.store.dispatch(new LogoutAction());
        } else {
          this.offerService.getOffers(this.distributer._id).subscribe(data => {
            this.offerList = data;
            if (data.items == null) {
              this.offeredBooks = [];
            } else {
              this.offeredBooks = this.offerList.items;
            }
            this.mdbTable.setDataSource(this.offeredBooks);
            this.offeredBooks = this.mdbTable.getDataSource();
            this.previous = this.mdbTable.getDataSource();
          });
        }
      });
    } else {
      this.message = 'Не постоји понуда.';
    }
  }

  addNewOffer() {
    this.addModal.show();
  }

  edit(rowIndex: number) {
    this.rowIndex = rowIndex;
  }

  add() {
    const bookIndex = this.offeredBooks.findIndex(x => x.isbn === this.book.isbn);
    if (bookIndex === -1) {
      this.offeredBooks.push(this.book);
      this.offerList.items = this.offeredBooks;
      this.offerService.addOffer(this.offerList).subscribe(data => {
        this.offerList = data;
        this.offeredBooks = data.items;
      });
      this.addModal.hide();
    } else {
      this.toast.error('Ова књига већ постоји у листи', 'Дупликат', {opacity: 1});
    }
  }
  remove() {
    const bookIndex = this.offeredBooks.findIndex(x => x.isbn === this.book.isbn);
    this.offeredBooks.splice(bookIndex, 1);
    this.offerList.items = this.offeredBooks;
    this.offerService.addOffer(this.offerList).subscribe(data => {
      this.offerList = data;
      this.offeredBooks = data.items;
    });
    this.modalDeleteOffer.hide();
  }
  update() {
    this.offerList.items = this.offeredBooks;
    this.offerService.addOffer(this.offerList).subscribe(data => {
      this.offerList = data;
      this.offeredBooks = data.items;
    });
    this.rowIndex = -1;
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.offeredBooks = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.offeredBooks = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  exportToPDF() {

    this.offerService.createOfferSheet(this.offerList._id).subscribe(response => {
      const pdf = new Blob([response], {type: 'application/octet-stream'});
      const url = window.URL.createObjectURL(pdf);
      // window.open(url, '_blank');
      const anchor = document.createElement('a');
      anchor.download = 'ponude.pdf';
      anchor.href = url;
      anchor.click();
    });
  }
}
