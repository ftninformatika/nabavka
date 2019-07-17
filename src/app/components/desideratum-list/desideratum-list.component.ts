import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Desideratum} from '../../models/desideratum';
import {Location} from '../../models/location';
import {FirebaseService} from '../../services/firebase.service';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-desideratum-list',
  templateUrl: './desideratum-list.component.html',
  styleUrls: ['./desideratum-list.component.scss']
})

export class DesideratumListComponent implements OnInit {
  @ViewChild('addLocationModal', {static: false}) modalLocation: ModalDirective;
  @ViewChild('modalDeleteDesideratum', {static: false}) modalDelete: ModalDirective;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  hide: Array<boolean> = [];
  hideInner: Array<boolean> = [];
  desiderataList: Desideratum[];
  location: Location = {};
  selectedId: string;
  rowIndex: number;
  visibleEditIcons: boolean;
  selectedDesideratum: Desideratum;
  searchText: string;
  previous: string;
  rowIndexLocation: number;
  visibleEditIconsLocation: boolean;
  inputAmount: number;


  constructor(private firebaseService: FirebaseService) {
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    this.firebaseService.getDesiderataData().subscribe(data => {
      this.desiderataList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as any
        } as Desideratum;
      });
      this.mdbTable.setDataSource(this.desiderataList);
      this.desiderataList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();
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
  }

  showEditIcons(index: number, id: string) {
    this.rowIndex = index;
    this.visibleEditIcons = true;
    this.selectedDesideratum = this.desiderataList.find(x => x.id === id);
  }

  saveEditedDesideratum() {
    this.firebaseService.updateDesideratum(this.selectedDesideratum);
    this.visibleEditIcons = false;
    this.rowIndex = null;
  }

  showAddLocationModal(id: string) {
    this.selectedId = id;
    this.location = {};
    this.modalLocation.show();
  }

  addLocation() {
    this.location.location = this.location.sublocation.substring(0, 2);
    const desideratum = this.desiderataList.find(x => x.id === this.selectedId);
    desideratum.locations.push(this.location);
    this.firebaseService.updateDesideratum(desideratum);
    this.modalLocation.hide();
  }

  showEditIconsForLocation(index: number, amount: number) {
    this.rowIndexLocation = index;
    this.visibleEditIconsLocation = true;
    this.inputAmount = amount;
  }

  updateAmount(id: string, sublocation: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const location = desideratum.locations.find(x => x.sublocation === sublocation);
    location.amount = this.inputAmount;
    this.firebaseService.updateDesideratum(desideratum);
    this.visibleEditIconsLocation = false;
    this.rowIndexLocation = null;
  }

  deleteLocation(id: string, sublocation: string) {
    const desideratum = this.desiderataList.find(x => x.id === id);
    const locationIndex = desideratum.locations.findIndex(x => x.sublocation === sublocation);
    desideratum.locations.splice(locationIndex, 1);
    this.firebaseService.updateDesideratum(desideratum);
    this.visibleEditIconsLocation = false;
    this.rowIndexLocation = null;
  }

  toggle(row) {
    this.hide[row] = !this.hide[row];
  }

  toggleInner(row) {
    this.hideInner[row] = !this.hideInner[row];
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
}
