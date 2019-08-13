import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Offer} from '../../models/offer';
import {Book} from '../../models/book';
import {ModalDirective, ToastService} from 'ng-uikit-pro-standard';
import {ActivatedRoute} from '@angular/router';
import {Distributor} from '../../models/distributor';
import {CryptoUtils} from '../../utils/crypto.utils';
import {Roles} from '../../configs/app.config';
import {UserState} from '../../states/user.state';
import {Store} from '@ngxs/store';

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
  public Roles = Roles;
  public loggedUserRole = this.store.select(UserState.getRole);
  // tslint:disable-next-line:max-line-length
  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private toast: ToastService, private store: Store) { }
  ngOnInit() {
    const encryptedPib = this.route.snapshot.paramMap.get('pib');
    this.pib = CryptoUtils.decryptData(encryptedPib);
    this.firebaseService.getDistributor(this.pib).subscribe(dist => {
      this.distributer = dist.map(e => {
        return {
          id: e.payload.doc.id,
          ... e.payload.doc.data()
        } as Distributor;
      })[0];
      if (this.distributer == null) {
        this.message = 'Не постоји понуда.';
      }
    });
    this.firebaseService.getOffers(this.pib).subscribe(data => {
      this.offerList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ... e.payload.doc.data()
        } as Offer;
      })[0];
      // tslint:disable-next-line:triple-equals
      if (this.offerList.items === undefined) {
        this.offeredBooks = [];
      } else {
        this.offeredBooks = this.offerList.items;
      }

  });

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
      this.firebaseService.updateOffer(this.offerList);
      this.addModal.hide();
    } else {
      this.toast.error('Ова књига већ постоји у листи', 'Дупликат', {opacity: 1});
    }
  }
  remove() {
    const bookIndex = this.offeredBooks.findIndex(x => x.isbn === this.book.isbn);
    this.offeredBooks.splice(bookIndex, 1);
    this.offerList.items = this.offeredBooks;
    this.firebaseService.updateOffer(this.offerList);
    this.modalDeleteOffer.hide();
  }
  update() {
    this.offerList.items = this.offeredBooks;
    this.firebaseService.updateOffer(this.offerList);
    this.rowIndex = -1;
  }
  onClosed(event: any) {
   this.book.isbn = null;
   this.book.vat = null;
   this.book.rebate = null;
   this.book.author = null;
   this.book.price = null;
   this.book.publisher = null;
   this.book.title = null;
  }
  getPermLink(pib: string) {
    return location.origin + '/offers/' + CryptoUtils.encryptData(pib);
  }


  linkCopied() {
    this.toast.info('Линк је копиран у <i>clipboard</i>.', '', { enableHtml: true});
  }
}
