import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {Sublocation} from '../../models/sublocation';
import {FirebaseService} from '../../services/firebase.service';
import {AcquisitionGroup, Item, Price} from '../../models/acquisition';

@Component({
  selector: 'app-acquisition-item',
  templateUrl: './acquisition-item.component.html',
  styleUrls: ['./acquisition-item.component.scss']
})
export class AcquisitionItemComponent implements OnInit {
  @Input() acquisitionGroup: AcquisitionGroup;
  @ViewChild('addLocationModal', {static: false}) modalLocation: ModalDirective;
  @ViewChild('modalDeleteDesideratum', {static: false}) modalDelete: ModalDirective;
  @ViewChild('modalAlreadyExists', {static: false}) modalAlreadyExists: ModalDirective;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  hide: boolean[] = [];
  hideInner: boolean[][] = [];
  location: Location = {};
  selectedIsbn: string;
  index1stLevel: number;
  index2ndLevel: number;
  index3rdLevel: number;
  selectedItem: Item;
  inputAmount: number;
  sublocationList: Sublocation[];

  constructor(private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    this.mdbTable.setDataSource(this.acquisitionGroup.items);
    this.resetHideLists();
    this.firebaseService.getSublocations().subscribe(data => {
      this.sublocationList = data.map(e => {
        return e.payload.doc.data() as Sublocation;
      });
    });
  }

  addItem(form: any, modalInstance: any) {
    const desideratum: Desideratum = {
      isbn: form[0].value,
      title: form[1].value,
      author: form[2].value,
      publisher: form[3].value
    };
    const item: Item = {desideratum, planedPrice: new Price()};
    this.acquisitionGroup.items.splice(0, 0, item);
    this.hide.splice(0, 0, false);
    this.hideInner.splice(0, 0, []);
    form.reset();
    modalInstance.hide();
  }

  showRemoveItemModal() {
    this.modalDelete.show();
  }

  removeSelectedItem() {
    const index = this.acquisitionGroup.items.findIndex(x => x.desideratum.isbn === this.selectedItem.desideratum.isbn);
    this.acquisitionGroup.items.splice(index, 1);
    this.hide.splice(index, 1);
    this.hideInner.splice(index, 1);
    this.modalDelete.hide();
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
  }

  showEditIcons(index: number, isbn: string) {
    this.index1stLevel = index;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.selectedItem = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
  }

  saveEditedItem() {
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
  }

  calculateAmountForItem(isbn: string) {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
    let amount = 0;
    if (item.desideratum.locations) {
      for (const location of item.desideratum.locations) {
        amount = amount + location.amount;
      }
    }
    return amount;
  }

  showAddLocationModal(index: number, isbn: string) {
    this.selectedIsbn = isbn;
    this.location = {};
    this.modalLocation.show();
  }

  addLocation() {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === this.selectedIsbn);
    if (!item.desideratum.locations) {
      item.desideratum.locations = [];
    }
    if (item.desideratum.locations.find(x => x.sublocation === this.location.sublocation)) {
      this.modalLocation.hide();
      this.modalAlreadyExists.show();
    } else {
      this.location.location = this.location.sublocation.substring(0, 2);
      item.desideratum.locations.push(this.location);
      const renderFix = [...item.desideratum.locations];
      item.desideratum.locations = renderFix;
      this.modalLocation.hide();
    }
  }

  showEditIconsForLocation(index1: number, index2: number, index3: number, amount: number) {
    this.index1stLevel = index1;
    this.index2ndLevel = index2;
    this.index3rdLevel = index3;
    this.inputAmount = amount;
  }

  updateAmount(isbn: string, sublocation: string) {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
    const location = item.desideratum.locations.find(x => x.sublocation === sublocation);
    location.amount = this.inputAmount;
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
  }

  deleteLocation(isbn: string, sublocation: string) {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
    const locationIndex = item.desideratum.locations.findIndex(x => x.sublocation === sublocation);
    item.desideratum.locations.splice(locationIndex, 1);
    const renderFix = [...item.desideratum.locations];
    item.desideratum.locations = renderFix;
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
  }

  calculateAmountForLocation(isbn: string, loc: string) {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
    const locations = item.desideratum.locations.filter(x => x.location === loc);
    let amount = 0;
    for (const location of locations) {
      amount = amount + location.amount;
    }
    return amount;
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

  selectSublocation(event: any) {
    this.location.sublocation = event as string;
  }

  getSublocation(code: string) {
    const sublocation = this.sublocationList.find(x => x.code === code);
    if (sublocation) {
      return sublocation.code + ' - ' + sublocation.name;
    } else {
      return code;
    }
  }

}
