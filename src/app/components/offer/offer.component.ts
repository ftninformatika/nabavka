import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Offer} from '../../models/offer';
import {Book} from '../../models/book';
import {ModalDirective, ToastService} from 'ng-uikit-pro-standard';
import {ActivatedRoute} from '@angular/router';
import {Distributor} from '../../models/distributor';
import {CryptoUtils} from '../../utils/crypto.utils';
import {Roles} from '../../configs/app.config';
import {LibrarySetupAction, LogoutAction, UserState} from '../../states/user.state';
import {Store} from '@ngxs/store';
import {RestApiService} from "../../services/rest-api.service";

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
  constructor(private restApi: RestApiService, private route: ActivatedRoute, private toast: ToastService, private store: Store) { }
  ngOnInit() {
    const encryptedLink = this.route.snapshot.paramMap.get('pib');
    const permlink = CryptoUtils.decryptData(encryptedLink);
    if (permlink != null) {
      this.pib = permlink.substring(permlink.indexOf(':') + 1);
      // ovo znaci da je na stranicu dosao distributor
      if (this.store.selectSnapshot(UserState.getLibrary) == null) {
        this.store.dispatch(new LibrarySetupAction(permlink.substring(0, permlink.indexOf(':'))));
      }
      this.restApi.getDistributor(this.pib).subscribe(dist => {
        this.distributer = dist;
        if (this.distributer == null ) {
          this.message = 'Не постоји понуда.';
          this.store.dispatch(new LogoutAction());
        } else {
          this.restApi.getOffers(this.distributer._id).subscribe(data => {
            this.offerList = data;
            if (data.items == null) {
              this.offeredBooks = [];
            } else {
              this.offeredBooks = this.offerList.items;
            }
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
      this.restApi.addOffer(this.offerList).subscribe(data => {
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
    this.restApi.addOffer(this.offerList).subscribe(data => {
      this.offerList = data;
      this.offeredBooks = data.items;
    });
    this.modalDeleteOffer.hide();
  }
  update() {
    this.offerList.items = this.offeredBooks;
    this.restApi.addOffer(this.offerList).subscribe(data => {
      this.offerList = data;
      this.offeredBooks = data.items;
    });
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

}
