import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {AcquisitionGroup, Price, Status} from '../../models/acquisition';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {AcquisitionService} from '../../services/acquisition.service';
import {Desideratum} from '../../models/desideratum';
import {Distribution} from '../../models/distribution';
import {Location} from '../../models/location';
import {BookForDelivery, Delivery} from '../../models/delivery';

@Component({
  selector: 'app-distribution-item',
  templateUrl: './distribution-item.component.html',
  styleUrls: ['./distribution-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DistributionItemComponent implements OnInit {

  @Input() distribution: Distribution;
  @Input() selectedView: string;
  @Output() reloadAcquisitionEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild('modalDistributionForm', {static: false}) modalDistributionForm: ModalDirective;
  hide: boolean[] = [];
  hideInner: boolean[][] = [];
  showForm: boolean;
  Status = Status;

  constructor(private acquisitionService: AcquisitionService) {
  }

  ngOnInit() {
    this.mdbTable.setDataSource(this.distribution);
    this.resetHideLists();
  }

  calculateAmountForGroup(acquisitionGroup: AcquisitionGroup) {
    let amount = 0;
    acquisitionGroup.items.forEach(item => {
      if (item.desideratum.locations) {
        for (const location of item.desideratum.locations) {
          amount = amount + location.amount;
        }
      }
    });
    return amount;
  }

  calculatePriceForGroup(acquisitionGroup: AcquisitionGroup) {
    let amount = 0;
    acquisitionGroup.items.forEach(item => {
      let locNo = 0;
      if (item.desideratum.locations) {
        for (const location of item.desideratum.locations) {
          locNo = locNo + location.amount;
        }
      }
      amount = amount + locNo * this.acquisitionService.calculatePriceWithVAT(item.realPrice);
    });
    return amount;
  }

  calculatePrice() {
    let amount = 0;
    if (this.distribution.acquisitionGroup) {
      this.distribution.acquisitionGroup.forEach(gruop => {
        amount = amount + this.calculatePriceForGroup(gruop);
      });
    }
    return amount;
  }

  calculateAmountForDesideratum(desideratum: Desideratum) {
    let amount = 0;
    desideratum.locations.forEach(location => {
      amount = amount + location.amount;
    });
    return amount;
  }

  calculatePriceForDesideratum(desideratum: Desideratum, price: Price) {
    let amount = 0;
    desideratum.locations.forEach(location => {
      amount = amount + location.amount;
    });
    return amount * this.acquisitionService.calculatePriceWithVAT(price);
  }

  calculatePriceWithVAT(price: Price) {
    return this.acquisitionService.calculatePriceWithVAT(price);
  }

  toggle(row) {
    this.hide[row] = !this.hide[row];
  }

  toggleInner(row, col) {
    if (!this.hideInner[row]) {
      this.hideInner[row] = [];
    }
    this.hideInner[row][col] = !this.hideInner[row][col];
  }

  resetHideLists() {
    if (this.distribution.acquisitionGroup) {
      for (const i of Object.keys(this.distribution.acquisitionGroup)) {
        this.hide[i] = false;
        this.hideInner[i] = [];
      }
    }
  }

  getSublocation(code: string) {
    return this.acquisitionService.getSublocation(code);
  }

  getLocation(code: string) {
    return this.acquisitionService.getLocation(code);
  }

  showDistributionForm(desideratum: Desideratum) {
    this.acquisitionService.setDistributionLocations(desideratum);
    this.showForm = true;
    this.modalDistributionForm.show();
  }

  cancelEdit() {
    this.modalDistributionForm.hide();
    this.reloadAcquisitionEvent.emit();
  }

  modalHide() {
    this.modalDistributionForm.hide();
  }

  exportToPDF(distribution: Distribution) {
    const deliveries = new Map<string, BookForDelivery[]>();
    let books;
    distribution.acquisitionGroup.forEach(dl => {
      dl.items.forEach(i => {
        i.desideratum.locations.forEach(l => {
          const b: BookForDelivery = {};
          b.amount = l.amount;
          const finalPrice = this.acquisitionService.calculatePriceWithVAT(i.realPrice);
          b.book = {title: i.desideratum.title, author: i.desideratum.author, publisher: i.desideratum.publisher, price: finalPrice};
          books = deliveries.get(l.sublocation);
          if (books === undefined) {
            books = [];
          }
          books.push(b);
          deliveries.set(l.sublocation, books);
        });
      });
    });
    const mapAsc = new Map([...deliveries.entries()].sort());
    const deliveriesArray = [];
    for (const [key, value] of mapAsc) {
      const d: Delivery = {};
      d.location = this.getSublocation(key);
      d.books = value;
      deliveriesArray.push(d);
    }
    const deliveryLocation = this.getLocation(distribution.location);
    this.acquisitionService.createDeliverySheet(deliveriesArray, deliveryLocation).subscribe(pdf => {
      const url = window.URL.createObjectURL(pdf);
      const anchor = document.createElement('a');
      anchor.download = 'Dostavnica_' + deliveryLocation + '.pdf';
      anchor.href = url;
      anchor.click();
    });

    /* const pwa = window.open(url);if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
       this.toast.warning('Искључите Pop-up blocker и покушајте поново да прузмете документ. ')
     }*/
  }
}
