import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AcquisitionGroup, DeliveryLocation, Price} from '../../models/acquisition';
import {MdbTableDirective} from 'ng-uikit-pro-standard';
import {LocationCoder, Sublocation} from '../../models/location_coder';
import { ToastService} from 'ng-uikit-pro-standard';
import {FirebaseService} from '../../services/firebase.service';
import {Desideratum} from '../../models/desideratum';
import {AcquisitionService} from '../../services/acquisition.service';
import {RestApiService} from '../../services/rest-api.service';
import {BookForDelivery, Delivery} from '../../models/delivery';

@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent implements OnInit {

  @Input() acquisitionGroup: AcquisitionGroup;
  @Input() acquisitionTitle: string;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  hide: boolean[] = [];
  hideInner: boolean[][] = [];
  sublocationList: Sublocation[] = [];
  locationList: LocationCoder[] = [];

  constructor(private acquisitionService: AcquisitionService) {
  }

  ngOnInit() {
    this.mdbTable.setDataSource(this.acquisitionGroup.items);
    this.resetHideLists();
    this.acquisitionService.getSublocations().subscribe(data => {
      this.sublocationList = data;
    });
    this.acquisitionService.getLocations().subscribe(data => {
      this.locationList = data;
    });
  }

  calculateAmountForLibrary(deliveryLocations: DeliveryLocation[]) {
    let amount = 0;
    deliveryLocations.forEach(deliveryLocation => {
      deliveryLocation.desideratum.locations.forEach(location => {
        amount = amount + location.amount;
      });
    });
    return amount;
  }

  calculatePriceForLibrary(deliveryLocations: DeliveryLocation[]) {
    let amount = 0;
    deliveryLocations.forEach(deliveryLocation => {
      let num = 0;
      deliveryLocation.desideratum.locations.forEach(location => {
        num = num + location.amount;
      });
      amount = amount + num * deliveryLocation.price.price;
    });
    return amount;
  }

  calculatePriceForGroup() {
    let amount = 0;
    this.acquisitionGroup.deliveryLocations.forEach(deliveryLocation => {
      let num = 0;
      deliveryLocation.desideratum.locations.forEach(location => {
        num = num + location.amount;
      });
      amount = amount + num * deliveryLocation.price.price;
    });
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
    return amount * price.price;
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
    for (const i of Object.keys(this.acquisitionGroup.items)) {
      this.hide[i] = false;
      this.hideInner[i] = [];
    }
  }

  getSublocation(code: string) {
    const sublocation = this.sublocationList.find(x => x.code === code);
    if (sublocation) {
      return sublocation.code + ' - ' + sublocation.name;
    } else {
      return code;
    }
  }

  getLocation(code: string) {
    const location = this.locationList.find(x => x.code === code);
    if (location) {
      return location.code + ' - ' + location.name;
    } else {
      return code;
    }
  }

  exportToPDF() {
    const deliveries = new Map();
    let books;
    this.acquisitionGroup.deliveryLocations.forEach(dl => {
      dl.desideratum.locations.forEach(l =>{
        const b: BookForDelivery = {};
        b.amount = l.amount;
        // izracunati konacnu cenu
        b.book = {title: dl.desideratum.title, author: dl.desideratum.author, publisher: dl.desideratum.publisher, price: dl.price.price};

        books = deliveries.get(l.sublocation);
        if (books === undefined) {
          books = [];
        }
        books.push(b);
        deliveries.set(l.sublocation, books);
      });
    });
    const mapAsc = new Map([...deliveries.entries()].sort());
    const deliveriesArray = [];
    for (const [key, value] of mapAsc) {
      const d: Delivery = {};
      d.location = key;
      d.books = value;
      deliveriesArray.push(d);
    }
    this.restAPI.createDeliverySheet(deliveriesArray, this.acquisitionTitle, this.acquisitionGroup.title).subscribe(response => {
      const pdf = new Blob([response], { type: 'application/octet-stream'});
      const url = window.URL.createObjectURL(pdf);
      const anchor = document.createElement('a');
      anchor.download = this.acquisitionGroup.title + '-' + this.acquisitionGroup.distributor + '.pdf';
      anchor.href = url;
      anchor.click();
     /* const pwa = window.open(url);if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
        this.toast.warning('Искључите Pop-up blocker и покушајте поново да прузмете документ. ')
      }*/

  });

  }

}
