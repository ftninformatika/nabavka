import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {LocationCoder, Sublocation} from '../../models/location_coder';
import {FirebaseService} from '../../services/firebase.service';
import {AcquisitionGroup, Item, Price, Status} from '../../models/acquisition';
import {AcquisitionService} from '../../services/acquisition.service';

@Component({
  selector: 'app-acquisition-item',
  templateUrl: './acquisition-item.component.html',
  styleUrls: ['./acquisition-item.component.scss']
})
export class AcquisitionItemComponent implements OnInit {
  @Input() acquisitionGroup: AcquisitionGroup;
  @Input() status: Status;
  @Input() editMode: boolean;
  @Output() updateAcquisitionGroupEvent: EventEmitter<AcquisitionGroup> = new EventEmitter<AcquisitionGroup>();
  @Output() deleteAcquisitionGroupEvent: EventEmitter<AcquisitionGroup> = new EventEmitter<AcquisitionGroup>();
  @ViewChild('addLocationModal', {static: false}) modalLocation: ModalDirective;
  @ViewChild('modalDeleteItem', {static: false}) modalDelete: ModalDirective;
  @ViewChild('modalDeleteAcquisitionGroup', {static: false}) modalDeleteGroup: ModalDirective;
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
  locationList: LocationCoder[];
  editGroup = false;
  Status = Status;

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

  addItem(form: any, modalInstance: any) {
    const desideratum: Desideratum = {
      isbn: form[0].value,
      title: form[1].value,
      author: form[2].value,
      publisher: form[3].value
    };
    const planedPrice: Price = {
      price: form[4].value,
      rebate: form[5].value,
      vat: form[6].value
    };
    const item: Item = {desideratum, planedPrice};
    this.acquisitionGroup.items.splice(0, 0, item);
    this.hide.splice(0, 0, false);
    this.hideInner.splice(0, 0, []);
    form.reset();
    modalInstance.hide();
    this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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
    this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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
    this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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

  calculatePriceForItem(isbn: string) {
    const item = this.acquisitionGroup.items.find(x => x.desideratum.isbn === isbn);
    let amount = 0;
    if (item.desideratum.locations) {
      for (const location of item.desideratum.locations) {
        amount = amount + location.amount;
      }
    }
    if (this.status === Status.OPEN) {
      return amount * item.planedPrice.price;
    } else {
      return amount * item.realPrice.price;
    }
  }

  calculatePriceForGroup() {
    let amount = 0;
    this.acquisitionGroup.items.forEach(item => {
      let locNo = 0;
      if (item.desideratum.locations) {
        for (const location of item.desideratum.locations) {
          locNo = locNo + location.amount;
        }
      }
      if (this.status === Status.OPEN) {
        amount = amount + locNo * item.planedPrice.price;
      } else {
        amount = amount + locNo * item.realPrice.price;
      }
    });
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
      this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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
    this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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
    this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
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

  getLocation(code: string) {
    const location = this.locationList.find(x => x.code === code);
    if (location) {
      return location.code + ' - ' + location.name;
    } else {
      return code;
    }
  }

  toggleEditGroup() {
    if (this.editGroup) {
      this.editGroup = false;
      this.updateAcquisitionGroupEvent.emit(this.acquisitionGroup);
    } else {
      this.editGroup = true;
    }
  }

  showDeleteGroupModal() {
    this.modalDeleteGroup.show();
  }

  deleteGroup() {
    this.modalDeleteGroup.hide();
    this.deleteAcquisitionGroupEvent.emit(this.acquisitionGroup);
  }

  getOtherAcquisitionGroups() {
    return this.acquisitionService.getOtherAcquisitionGroups(this.acquisitionGroup);
  }

  moveToAcquisitionGroup(name: string) {
    const index = this.acquisitionGroup.items.findIndex(x => x.desideratum.isbn === this.selectedItem.desideratum.isbn);
    this.acquisitionGroup.items.splice(index, 1);
    this.hide.splice(index, 1);
    this.hideInner.splice(index, 1);
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.acquisitionService.moveItemToGroup(this.selectedItem, name);
  }

}
