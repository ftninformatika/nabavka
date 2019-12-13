import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AcquisitionService} from '../../services/acquisition.service';
import {Desideratum} from '../../models/desideratum';

@Component({
  selector: 'app-distribution-form',
  templateUrl: './distribution-form.component.html',
  styleUrls: ['./distribution-form.component.scss']
})
export class DistributionFormComponent implements OnInit {

  @Input() location;
  @Output() modalHideEvent: EventEmitter<void> = new EventEmitter<void>();
  desideratum: Desideratum = {locations: []};
  private copies;
  private options = [];

  constructor(private acquisitionService: AcquisitionService) { }

  ngOnInit() {
    this.acquisitionService.getSublocationList().forEach(s => {
      if (s.coder_id.startsWith(this.location)) {
        this.options.push(
        {
          value: s.coder_id,
          label: s.coder_id + ' - ' + s.description
        });
      }
    });
    this.acquisitionService.distributionLocations$.subscribe(desideratum => {
      this.desideratum = desideratum;
      this.copies = this.calculateAmount();
    });
  }

  calculateAmount() {
    let amount = 0;
    if (this.desideratum) {
      this.desideratum.locations.forEach(location => {
        amount = amount + location.amount;
      });
      return amount;
    }
  }

  notValidAmount(): boolean {
    return (this.calculateAmount() - this.copies !== 0);
  }

  notValidSublocation(): boolean {
    let found = false;
    if (this.desideratum) {
      this.desideratum.locations.forEach(s => {
        if (s.sublocation === undefined) {
          found = true;
        }
      });
    }
    return found;
  }

  sublocationAlreadyExists() {
    for (const loc of this.desideratum.locations) {
      let num = 0;
      for (const loc2 of this.desideratum.locations) {
        if (loc2.sublocation === loc.sublocation) {
          num++;
        }
        if (num === 2) {
          return true;
        }
      }
    }
    return false;
  }

  notValid(): boolean {
    return this.notValidSublocation() || this.notValidAmount() || this.sublocationAlreadyExists();
  }

  addNewLocation() {
    const loc = {amount: 0};
    this.desideratum.locations.splice(0, 0, loc);
    this.acquisitionService.addNewLocation(this.desideratum.isbn, loc);
  }

  deleteSublocation(index: number) {
    const loc = this.desideratum.locations[index];
    this.desideratum.locations.splice(index, 1);
    this.acquisitionService.deleteLocation(this.desideratum.isbn, loc);
  }

  saveAcquisition() {
    this.desideratum.locations.forEach( s => {
      s.location = s.sublocation.substring(0, 2);
    });
    this.acquisitionService.saveOrUpdateAcquisition();
    this.modalHideEvent.emit();
  }
}
