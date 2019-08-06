import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {ActivatedRoute} from '@angular/router';
import {Acquisition, AcquisitionGroup, Item, Price, Status} from '../../models/acquisition';
import {Desideratum} from '../../models/desideratum';
import {GroupByPipe} from '../../pipes/group-by.pipe';
import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

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
  edit = false;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private groupBy: GroupByPipe) {
  }

  ngOnInit() {
    this.acquisitionId = this.route.snapshot.paramMap.get('id');
    // this.acquisitionId = 'w80tqpWSj4X1ndlzhZBb';
    this.firebaseService.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc.exists) {
        this.acquisition = doc.data() as Acquisition;
        this.calculateAmount();
        // console.log(this.acquisition);
      }
    });

    // let desiderataList: Desideratum[];
    // this.firebaseService.getDesiderataDataOnce().subscribe(data => {
    //   desiderataList = data.docs.map(e => {
    //     return e.data() as Desideratum;
    //   });
    //   const desiderataGroups = this.groupBy.transform(desiderataList, 'publisher');
    //   this.acquisition = {title: '2017 - I deo', startDate: new Date(2017, 3, 1), budget: 100000,
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
      this.amount = 0;
      this.acquisition.acquisitionGroups.forEach(group => {
        group.items.forEach(item => {
          let locNo = 0;
          if (item.desideratum.locations) {
            for (const location of item.desideratum.locations) {
              locNo = locNo + location.amount;
            }
          }
          this.amount = this.amount + locNo * item.planedPrice.price;
        });
      });
    }
  }

  toggleEdit() {
    if (this.acquisition) {
      if (this.edit) {
        this.edit = false;
        this.saveAcquisition();
      } else {
        this.edit = true;
      }
    }
  }

  parseDate(value: any) {
    this.acquisition.startDate = new Date(value);
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

  updateAcquisitionGroup(acquisitionGroup: AcquisitionGroup) {
    this.calculateAmount();
    this.saveAcquisition();
  }

  deleteAcquisitionGroup(acquisitionGroup: AcquisitionGroup) {
    const groupIndex = this.acquisition.acquisitionGroups.findIndex(x => x === acquisitionGroup);
    this.acquisition.acquisitionGroups.splice(groupIndex, 1);
    this.calculateAmount();
    this.saveAcquisition();
  }

  addAcquisitionGroup(form: any, modalInstance: any) {
    const acquisitionGroup: AcquisitionGroup = {
      title: form[0].value,
      distributor: form[1].value,
      items: []
    };
    this.acquisition.acquisitionGroups.splice(0, 0, acquisitionGroup);
    form.reset();
    modalInstance.hide();
    this.saveAcquisition();
  }
}
