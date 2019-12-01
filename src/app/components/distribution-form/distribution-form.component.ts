import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../models/location';
import {AcquisitionService} from '../../services/acquisition.service';

@Component({
  selector: 'app-distribution-form',
  templateUrl: './distribution-form.component.html',
  styleUrls: ['./distribution-form.component.scss']
})
export class DistributionFormComponent implements OnInit {

  @Input() location;
  sublocations: Location[];
  private copies;
  private options = [];

  constructor(private acquisitionService: AcquisitionService) { }

  ngOnInit() {
    this.acquisitionService.getSublocationList().forEach(s => {
      if (s.code.startsWith(this.location)) {
        this.options.push(
        {
          value: s.code,
          label: s.code + ' - ' + s.name
        });
      }
    });
    this.acquisitionService.distributionLocations$.subscribe(locations => {
      this.sublocations = locations;
      this.copies = this.calculateAmount();
      console.log(this.sublocations);
    });
  }

  calculateAmount() {
    let amount = 0;
    if (this.sublocations) {
      this.sublocations.forEach(location => {
        amount = amount + location.amount;
      });
      return amount;
    }
  }

  notValid(): boolean {
    return this.calculateAmount() - this.copies !== 0;
  }
}
