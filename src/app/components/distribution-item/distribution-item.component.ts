import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {AcquisitionGroup, Price, Status} from '../../models/acquisition';
import {MdbTableDirective, ModalDirective} from 'ng-uikit-pro-standard';
import {AcquisitionService} from '../../services/acquisition.service';
import {Desideratum} from '../../models/desideratum';
import {Distribution} from '../../models/distribution';

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
    this.distribution.acquisitionGroup.forEach(gruop => {
      amount = amount + this.calculatePriceForGroup(gruop);
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
    for (const i of Object.keys(this.distribution.acquisitionGroup)) {
      this.hide[i] = false;
      this.hideInner[i] = [];
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

}
