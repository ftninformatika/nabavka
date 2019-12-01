import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {FirebaseService} from '../../services/firebase.service';
import {IOption, MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {LocationCoder, Sublocation} from '../../models/location_coder';
import {DesideratumService} from '../../services/desideratum.service';

@Component({
  selector: 'app-desideratum-list',
  templateUrl: './desideratum-list.component.html',
  styleUrls: ['./desideratum-list.component.scss']
})

export class DesideratumListComponent implements OnInit {
  @ViewChild('addLocationModal', {static: false}) modalLocation: ModalDirective;
  @ViewChild('modalDeleteDesideratum', {static: false}) modalDelete: ModalDirective;
  @ViewChild('modalAlreadyExists', {static: false}) modalAlreadyExists: ModalDirective;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  hide: boolean[] = [];
  hideInner: boolean[][] = [];
  desiderataList: Desideratum[];
  location: Location = {};
  selectedId: string;
  index1stLevel: number;
  index2ndLevel: number;
  index3rdLevel: number;
  selectedDesideratum: Desideratum;
  searchText: string;
  previous: string;
  inputAmount: number;

  constructor(private desideratumService: DesideratumService) {
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    // this.firebaseService.getDesiderataData().subscribe(data => {
    //   this.desiderataList = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       ...e.payload.doc.data() as any
    //     } as Desideratum;
    //   });
    //   this.mdbTable.setDataSource(this.desiderataList);
    //   this.desiderataList = this.mdbTable.getDataSource();
    //   this.previous = this.mdbTable.getDataSource();
    //   this.resetHideLists();
    // });
    this.desideratumService.getDesiderataData().subscribe(data => {
      this.desiderataList = data;
      this.mdbTable.setDataSource(this.desiderataList);
      this.desiderataList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
      this.resetHideLists();
    });
    // this.desideratumService.getSublocations().subscribe(data => {
    //   this.sublocationList = data;
    // });
    // this.desideratumService.getLocations().subscribe(data => {
    //   this.locationList = data;
    // });
  }

  addDesideratum(form: any, modalInstance: any) {
    const desideratum: Desideratum = {
      isbn: form[0].value,
      title: form[1].value,
      author: form[2].value,
      publisher: form[3].value
    };
    this.desideratumService.addDesideratum(desideratum).subscribe(data => {
      desideratum.id = data;
    });
    this.desiderataList.splice(0, 0, desideratum);
    this.hide.splice(0, 0, false);
    this.hideInner.splice(0, 0, []);
    form.reset();
    modalInstance.hide();
  }

  showRemoveDesideratumModal() {
    this.modalDelete.show();
  }

  removeSelectedDesideratum() {
    this.desideratumService.deleteDesideratum(this.selectedDesideratum.id).subscribe(data => {
      const index = this.desiderataList.findIndex(x => x.id === this.selectedDesideratum.id);
      this.desiderataList.splice(index, 1);
      this.hide.splice(index, 1);
      this.hideInner.splice(index, 1);
      this.modalDelete.hide();
      this.index1stLevel = null;
      this.index2ndLevel = null;
      this.index3rdLevel = null;
    });
  }

  showEditIcons(index: number, id: string) {
    this.index1stLevel = index;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.selectedDesideratum = this.desiderataList.find(x => x.id === id);
  }

  saveEditedDesideratum() {
    this.desideratumService.updateDesideratum(this.selectedDesideratum).subscribe(data => {
      this.index1stLevel = null;
      this.index2ndLevel = null;
      this.index3rdLevel = null;
    });
  }

  calculateAmountForDesideratum(id: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    let amount = 0;
    if (desideratum.locations) {
      for (const location of desideratum.locations) {
        amount = amount + location.amount;
      }
    }
    return amount;
  }

  showAddLocationModal(index: number, id: string) {
    this.selectedId = id;
    this.location = {};
    this.modalLocation.show();
  }

  addLocation() {
    const desideratum = this.desiderataList.find(x => x.id === this.selectedId);
    if (!desideratum.locations) {
      desideratum.locations = [];
    }
    if (desideratum.locations.find(x => x.sublocation === this.location.sublocation)) {
      this.modalLocation.hide();
      this.modalAlreadyExists.show();
    } else {
      this.location.location = this.location.sublocation.substring(0, 2);
      desideratum.locations.push(this.location);
      const renderFix = [...desideratum.locations];
      desideratum.locations = renderFix;
      this.desideratumService.updateDesideratum(desideratum).subscribe(data => {
        this.modalLocation.hide();
      });
    }
  }

  showEditIconsForLocation(index1: number, index2: number, index3: number, amount: number) {
    this.index1stLevel = index1;
    this.index2ndLevel = index2;
    this.index3rdLevel = index3;
    this.inputAmount = amount;
  }

  updateAmount(id: string, sublocation: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const location = desideratum.locations.find(x => x.sublocation === sublocation);
    location.amount = this.inputAmount;
    this.desideratumService.updateDesideratum(desideratum).subscribe(data => {
      this.index1stLevel = null;
      this.index2ndLevel = null;
      this.index3rdLevel = null;
    });
  }

  deleteLocation(id: string, sublocation: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const locationIndex = desideratum.locations.findIndex(x => x.sublocation === sublocation);
    desideratum.locations.splice(locationIndex, 1);
    const renderFix = [...desideratum.locations];
    desideratum.locations = renderFix;
    this.desideratumService.updateDesideratum(desideratum).subscribe(data => {
      this.index1stLevel = null;
      this.index2ndLevel = null;
      this.index3rdLevel = null;
    });
  }

  calculateAmountForLocation(id: string, loc: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const locations = desideratum.locations.filter(x => x.location === loc);
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
    for (const i of Object.keys(this.desiderataList)) {
      this.hide[i] = false;
      this.hideInner[i] = [];
    }
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.desiderataList = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.desiderataList = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }

  selectSublocation(event: any) {
    this.location.sublocation = event as string;
  }

  getSublocation(code: string) {
    return this.desideratumService.getSublocation(code);
  }

  getLocation(code: string) {
    return this.desideratumService.getLocation(code);
  }

}
