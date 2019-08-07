import {Component, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Offer} from '../../models/offer';
import {Book} from '../../models/book';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {ActivatedRoute} from '@angular/router';
import {Distributor} from '../../models/distributor';

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
  test: string;
  @ViewChild(ModalDirective, {static: false})
  modal: ModalDirective;
  distributer: Distributor;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.pib = this.route.snapshot.paramMap.get('pib');
    this.firebaseService.getDistributor(this.pib).subscribe(dist => {
      this.distributer = dist.map(e => {
        return {
          id: e.payload.doc.id,
          ... e.payload.doc.data() as any
        } as Distributor;
      })[0];
    });
    this.firebaseService.getOffers(this.pib).subscribe(data => {
      this.offerList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ... e.payload.doc.data() as any
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
    this.modal.show();
  }

  edit(rowIndex: number) {
    this.rowIndex = rowIndex;
  }

  add() {
    this.offeredBooks.push(this.book);
    this.offerList.items = this.offeredBooks;
    this.firebaseService.updateOffer(this.offerList);
    this.modal.hide();
  }
  remove(offer: Book) {
    const bookIndex = this.offeredBooks.findIndex(x => x.isbn === offer.isbn);
    this.offeredBooks.splice(bookIndex, 1);
    this.offerList.items = this.offeredBooks;
    this.firebaseService.updateOffer(this.offerList);
  }
  update() {
    this.offerList.items = this.offeredBooks;
    this.firebaseService.updateOffer(this.offerList);
    this.rowIndex = -1;
  }
}
