import {Component, Input, OnInit} from '@angular/core';
import {Distribution} from '../../models/distribution';
import {Delivery} from '../../models/acquisition';
import {AcquisitionService} from '../../services/acquisition.service';

@Component({
  selector: 'app-delivery-item',
  templateUrl: './delivery-item.component.html',
  styleUrls: ['./delivery-item.component.scss']
})
export class DeliveryItemComponent implements OnInit {

  @Input() delivery: Delivery;
  @Input() selectedView: string;
  distributions: Distribution[];

  constructor(private acquisitionService: AcquisitionService) { }

  ngOnInit() {
  }

  getDistributions(): Distribution[] {
    if (!this.distributions) {
      this.distributions = [];
      this.acquisitionService.getDistributions().forEach(d => {
        const distribution = {...d};
        distribution.acquisitionGroup = [];
        this.distributions.push(distribution);
        d.acquisitionGroup.forEach(g => {
          if (this.delivery.acquisitionGroups.find(x => x === g.title)) {
            distribution.acquisitionGroup.push(g);
          }
        });
      });
    }
    return this.distributions;
  }

}
