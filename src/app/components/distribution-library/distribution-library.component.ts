import { Component, OnInit } from '@angular/core';
import {AcquisitionService} from '../../services/acquisition.service';
import {Status} from '../../models/acquisition';
import {Distribution} from '../../models/distribution';

@Component({
  selector: 'app-distribution-library',
  templateUrl: './distribution-library.component.html',
  styleUrls: ['./distribution-library.component.scss']
})
export class DistributionLibraryComponent implements OnInit {

  Status = Status;
  distribution: Distribution = {};
  location = '01';

  constructor(private acquisitionService: AcquisitionService) { }

  ngOnInit() {
    this.loadAcquisition();
  }

  loadAcquisition() {
    this.acquisitionService.getLastAcquisitionForDistribution().subscribe(acquisition => {
      this.distribution = this.acquisitionService.getDistributions().find(x => x.location === this.location);
    });
  }

  reloadAcquisition() {
    this.loadAcquisition();
  }
}
