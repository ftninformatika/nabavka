import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Acquisition, AcquisitionGroup, Delivery, Status} from '../../models/acquisition';
import {GroupByPipe} from '../../pipes/group-by.pipe';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {AcquisitionService} from '../../services/acquisition.service';
import {Distribution} from '../../models/distribution';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.scss'],
  providers: [ GroupByPipe ],
  encapsulation: ViewEncapsulation.None
})

export class AcquisitionComponent implements OnInit {
  @ViewChild('modalChangeStatus', {static: false}) modalChangeStatus: ModalDirective;
  @ViewChild('modalAddDelivery', {static: false}) modalAddDelivery: ModalDirective;
  acquisition: Acquisition = {};
  acquisitionId: string;
  amount = 0;
  edit = false;
  Status = Status;
  selectedView = Status.OPEN;
  delivery: Delivery = {};
  acquisitionGroups = [];


  constructor(private route: ActivatedRoute, private router: Router,
              private groupBy: GroupByPipe, private acquisitionService: AcquisitionService) {}

  ngOnInit() {
    this.acquisitionId = this.route.snapshot.paramMap.get('id');
    // this.acquisitionId = 'w80tqpWSj4X1ndlzhZBb';
    this.acquisitionService.getAcquisition(this.acquisitionId).subscribe(acquisition => {
        this.acquisition = acquisition;
        this.calculateAmount();
        this.setStepper();
        this.getAcquisitionGroups();
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

  reloadAcquisition() {
    this.acquisitionService.getAcquisition(this.acquisitionId).subscribe(acquisition => {
      this.acquisition = acquisition;
      this.calculateAmount();
      this.setStepper();
      if (this.selectedView === Status.DISTRIBUTION) {

      }
    });
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
          if (this.acquisition.status === Status.OPEN) {
            this.amount = this.amount + locNo * this.acquisitionService.calculatePriceWithVAT(item.planedPrice);
          } else {
            this.amount = this.amount + locNo * this.acquisitionService.calculatePriceWithVAT(item.realPrice);
          }
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

  parseDate(value: any, field: string) {
    if (field === 'start') {
      this.acquisition.startDate = new Date(value);
    } else {
      this.acquisition.acquisitionDate = new Date(value);
    }
  }

  saveAcquisition() {
    this.acquisitionService.saveAcquisition();
    // this.firebaseService.updateAcquisition(this.acquisitionId, this.acquisition);
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

  updateDesiderata() {
    this.acquisition.desiderataUpdated = true;
    // not working with firestore
    // this.saveAcquisition();
    // TODO update desiderata
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

  deleteAcquisition() {
    this.acquisitionService.deleteAcquisition().subscribe(data => {
      this.router.navigate(['/dashboard']);
    });
  }

  changeStatus() {
    if (this.acquisition.status === Status.OPEN) {
      this.acquisition.status = Status.CLOSED;
      this.acquisition.acquisitionGroups.forEach(group => {
        group.items.forEach(item => {
          item.realPrice = {...item.planedPrice};
        });
      });
    } else if (this.acquisition.status === Status.CLOSED) {
      this.acquisition.status = Status.DISTRIBUTION;
    } else if (this.acquisition.status === Status.DISTRIBUTION) {
      this.acquisition.status = Status.DELIVERY;
    }
    this.modalChangeStatus.hide();
    this.saveAcquisition();
    this.setStepper();
  }

  setStepper() {
    if (this.acquisition) {
      if (this.acquisition.status === Status.OPEN) {
        this.selectedView = Status.OPEN;
      }
      if (this.acquisition.status === Status.CLOSED) {
        this.selectedView = Status.CLOSED;
      } else if (this.acquisition.status === Status.DISTRIBUTION) {
        this.selectedView = Status.DISTRIBUTION;
      } else if (this.acquisition.status === Status.DELIVERY) {
        this.selectedView = Status.DELIVERY;
      }
    }
  }

  selectView(status: Status) {
    if (status === Status.OPEN) {
      this.selectedView = status;
    }
    if (status === Status.CLOSED) {
      if (this.acquisition.status === Status.CLOSED || this.acquisition.status === Status.DISTRIBUTION || this.acquisition.status === Status.DELIVERY) {
        this.selectedView = status;
      }
    }
    if (status === Status.DISTRIBUTION) {
      if (this.acquisition.status === Status.DISTRIBUTION || this.acquisition.status === Status.DELIVERY) {
        this.selectedView = status;
      }
    }
    if (status === Status.DELIVERY) {
      if (this.acquisition.status === Status.DELIVERY) {
        this.selectedView = status;
      }
    }
  }

  getDistributions(): Distribution[] {
    return this.acquisitionService.getDistributions();
  }

  getAcquisitionGroups() {
    if (this.acquisition.acquisitionGroups) {
      const list = [];
      this.acquisition.acquisitionGroups.forEach(g => {
        list.push({
            value: g.title,
            label: g.title
          }
        );
      });
      this.acquisitionGroups = list;
    }
  }

  createDelivery() {
    this.delivery = {};
    this.modalAddDelivery.show();
  }

  addDeliveryGroup(event: any) {
    this.delivery.acquisitionGroups = event;
  }

  saveDelivery() {
    if (!this.acquisition.deliveries) {
      this.acquisition.deliveries = [];
    }
    this.acquisition.deliveries.push(this.delivery);
    this.acquisitionService.saveAcquisition();
    this.modalAddDelivery.hide();
  }
}
