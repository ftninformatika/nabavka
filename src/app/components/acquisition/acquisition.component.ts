import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {ActivatedRoute} from '@angular/router';
import {Acquisition, AcquisitionGroup, Item, Status} from '../../models/acquisition';
import {Desideratum} from '../../models/desideratum';
import {GroupByPipe} from '../../pipes/group-by.pipe';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.scss'],
  providers: [ GroupByPipe ]
})
export class AcquisitionComponent implements OnInit {
  acquisitionId: string;
  acquisition: Acquisition = {};
  amount = 0;
  editBudget = false;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private groupBy: GroupByPipe) { }

  ngOnInit() {
    // this.acquisitionId = this.route.snapshot.paramMap.get('acquisition_id');
    this.acquisitionId = 'w80tqpWSj4X1ndlzhZBb';
    this.firebaseService.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc.exists) {
        this.acquisition = doc.data() as Acquisition;
        this.calculateAmount();
        console.log(this.acquisition);
      }
    });

    // let desiderataList: Desideratum[];
    // this.firebaseService.getDesiderataDataOnce().subscribe(data => {
    //   desiderataList = data.docs.map(e => {
    //     return e.data() as Desideratum;
    //   });
    //   const desiderataGroups = this.groupBy.transform(desiderataList, 'publisher');
    //   this.acquisition = {year: '2019', num: 'I deo', startDate: new Date(2019, 2, 1), budget: 100000,
    //     status: Status.OPEN, desiderataUpdated: false};
    //   const acquisitionGroups: AcquisitionGroup[] = [];
    //   desiderataGroups.forEach((desiderataGroup, index) => {
    //     const acquisitionGroup: AcquisitionGroup = {title: 'Partija ' + (index + 1), distributor: desiderataGroup.key};
    //     const items: Item[] = [];
    //     desiderataGroup.value.forEach(desideratum => {
    //       const item: Item = {desideratum, planedPrice: {price: 900, rebate: 10, vat: 10}};
    //       items.push(item);
    //     });
    //     acquisitionGroup.items = items;
    //     acquisitionGroups.push(acquisitionGroup);
    //   });
    //   this.acquisition.acquisitionGroups = acquisitionGroups;
    //   this.firebaseService.addAcquisition(this.acquisition);
    //   console.log(this.acquisition);
    // });
  }

  calculateAmount() {
    if (this.acquisition) {
      this.acquisition.acquisitionGroups.forEach(group => {
        group.items.forEach(item => {
          this.amount = this.amount + item.planedPrice.price;
        });
      });
    }
  }

  toggleEditBudget() {
    if (this.acquisition.budget) {
      if (this.editBudget) {
        this.editBudget = false;
        this.saveAcquisition();
      } else {
        this.editBudget = true;
      }
    }
  }

  saveAcquisition() {
    this.firebaseService.updateAcquisition(this.acquisitionId, this.acquisition);
  }

  getRemain() {
    if (this.acquisition.budget) {
      return this.acquisition.budget - this.amount;
    } else {
      return 0 - this.amount;
    }
  }
}
