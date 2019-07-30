import {ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {FirebaseService} from '../../services/firebase.service';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {Sublocation} from '../../models/sublocation';

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
  index1stLevelForLocation: number;
  index1stLevel: number;
  index2ndLevel: number;
  index3rdLevel: number;
  selectedDesideratum: Desideratum;
  searchText: string;
  previous: string;
  inputAmount: number;
  disableToggle: boolean;
  sublocationList: Sublocation[];

  constructor(private firebaseService: FirebaseService) {
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
    this.firebaseService.getDesiderataDataOnce().subscribe(data => {
      this.desiderataList = data.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as Desideratum;
      });
      this.mdbTable.setDataSource(this.desiderataList);
      this.desiderataList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
      this.resetHideLists();
    });
    this.firebaseService.getSublocations().subscribe(data => {
      this.sublocationList = data.map(e => {
        return e.payload.doc.data() as Sublocation;
      });
    });
  }

  addDesideratum(form: any, modalInstance: any) {
    const desideratum: Desideratum = {
      isbn: form[0].value,
      title: form[1].value,
      author: form[2].value,
      publisher: form[3].value
    };
    this.firebaseService.addDesideratum(desideratum);
    this.desiderataList.splice(0, 0, desideratum);
    form.reset();
    modalInstance.hide();
  }

  showRemoveDesideratumModal(id: string) {
    this.selectedId = id;
    this.modalDelete.show();
  }

  removeSelectedDesideratum() {
    this.firebaseService.deleteDesideratum(this.selectedId);
    this.modalDelete.hide();
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.disableToggle = false;
  }

  showEditIcons(index: number, id: string) {
    this.index1stLevel = index;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.selectedDesideratum = this.desiderataList.find(x => x.id === id);
    this.disableToggle = true;
  }

  saveEditedDesideratum() {
    this.firebaseService.updateDesideratum(this.selectedDesideratum);
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.disableToggle = false;
    this.searchItems();
    this.searchItems();
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
    this.index1stLevelForLocation = index;
    this.selectedId = id;
    this.location = {};
    this.modalLocation.show();
  }

  addLocation() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
      console.log('change');
    });
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
      this.firebaseService.updateDesideratum(desideratum);

      this.mdbTable.getDataSource().forEach((el: any, index: any) => {
        if (el.id === desideratum.id) {
          el.locations = desideratum.locations;
          console.log(el);
        }
      });

      this.modalLocation.hide();
      // this.desiderataList = [...this.desiderataList];
      // this.mdbTable.setDataSource(this.desiderataList);
      // this.desiderataList = this.mdbTable.getDataSource();
      // this.previous = this.mdbTable.getDataSource();

    }
  }

  showEditIconsForLocation(index1: number, index2: number, index3: number, amount: number) {
    this.index1stLevel = index1;
    this.index2ndLevel = index2;
    this.index3rdLevel = index3;
    this.inputAmount = amount;
    this.disableToggle = true;
  }

  updateAmount(id: string, sublocation: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const location = desideratum.locations.find(x => x.sublocation === sublocation);
    location.amount = this.inputAmount;
    this.firebaseService.updateDesideratum(desideratum);
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.disableToggle = false;
  }

  deleteLocation(id: string, sublocation: string) {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
      console.log('change');
    });
    const desideratum = this.desiderataList.find(x => x.id === id);
    const locationIndex = desideratum.locations.findIndex(x => x.sublocation === sublocation);
    desideratum.locations.splice(locationIndex, 1);
    this.firebaseService.updateDesideratum(desideratum);
    this.mdbTable.rowRemoved().subscribe((data: any) => {
      console.log('removed');
      console.log(data);
      this.mdbTable.setDataSource(this.desiderataList);
      this.desiderataList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
    });
    this.index1stLevel = null;
    this.index2ndLevel = null;
    this.index3rdLevel = null;
    this.disableToggle = false;
  }

  emitDataSourceChange() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
      console.log('emit change');
      console.log(data);
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
    //console.log('toggle' + row);
    //if (!this.disableToggle) {
      this.hide[row] = !this.hide[row];
    //}
  }

  toggleInner(row, col) {
    if (!this.disableToggle) {
      if (!this.hideInner[row]) {
        this.hideInner[row] = [];
      }
      this.hideInner[row][col] = !this.hideInner[row][col];
    }
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
    const sublocation = this.sublocationList.find(x => x.code === code);
    if (sublocation) {
      return sublocation.code + ' - ' + sublocation.name;
    } else {
      return code;
    }
  }
}
