import { Component, OnInit } from '@angular/core';
import {AcquisitionService} from '../../services/acquisition.service';
import {Status} from '../../models/acquisition';
import {Distribution} from '../../models/distribution';
import {Store} from '@ngxs/store';
import {UserState} from '../../states/user.state';

@Component({
  selector: 'app-distribution-library',
  templateUrl: './distribution-library.component.html',
  styleUrls: ['./distribution-library.component.scss']
})
export class DistributionLibraryComponent implements OnInit {

  Status = Status;
  distribution: Distribution = {acquisitionGroup: []};
  location;

  constructor(private acquisitionService: AcquisitionService, private store: Store) {
    this.location = this.store.selectSnapshot(UserState.getLocation);
  }

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
