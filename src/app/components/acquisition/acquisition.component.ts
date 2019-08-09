import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Acquisition, AcquisitionGroup, DeliveryLocation, Status} from '../../models/acquisition';
import {GroupByPipe} from '../../pipes/group-by.pipe';
import {MdbStepComponent, MdbStepperComponent, ModalDirective} from 'ng-uikit-pro-standard';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.scss'],
  providers: [ GroupByPipe ],
  encapsulation: ViewEncapsulation.None
})

export class AcquisitionComponent implements OnInit {
  @ViewChild('modalChangeStatus', {static: false}) modalChangeStatus: ModalDirective;
  @ViewChild('stepper', { static: true }) stepper: MdbStepperComponent;
  acquisitionId: string;
  acquisition: Acquisition = {};
  amount = 0;
  edit = false;
  Status = Status;
  firstFormControl = new FormControl(false, Validators.requiredTrue);
  secondFormControl = new FormControl(false, Validators.requiredTrue);
  thirdFormControl = new FormControl(false, Validators.requiredTrue);
  visibleCard = 0;

  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private router: Router,
              private groupBy: GroupByPipe) {}

  ngOnInit() {
    this.acquisitionId = this.route.snapshot.paramMap.get('id');
    // this.acquisitionId = 'w80tqpWSj4X1ndlzhZBb';
    this.firebaseService.getAcquisitionOnce(this.acquisitionId).subscribe(doc => {
      if (doc.exists) {
        this.acquisition = doc.data() as Acquisition;
        this.calculateAmount();
        // console.log(this.acquisition);
        this.setStepper();
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
          if (this.acquisition.status === Status.OPEN) {
            this.amount = this.amount + locNo * item.planedPrice.price;
          } else {
            this.amount = this.amount + locNo * item.realPrice.price;
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

  deleteAcquisition() {
    this.firebaseService.deleteAcquisition(this.acquisitionId).then(docRef => {
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
      this.acquisition.status = Status.DELIVERY;
    }
    this.modalChangeStatus.hide();
    this.saveAcquisition();
    this.setStepper();
  }

  setStepper() {
    if (this.acquisition) {
      if (this.acquisition.status === Status.OPEN) {
        this.firstFormControl.setValue(false);
        this.secondFormControl.setValue(false);
        this.stepper.setNewActiveStep(0);
      }
      if (this.acquisition.status === Status.CLOSED) {
        this.firstFormControl.setValue(true);
        this.secondFormControl.setValue(false);
        // this.stepper.setNewActiveStep(1);
        this.stepper.next();
      } else if (this.acquisition.status === Status.DELIVERY) {
        this.firstFormControl.setValue(true);
        this.secondFormControl.setValue(true);
        // this.stepper.setNewActiveStep(2);
        this.stepper.next();
        this.stepper.next();
      }
    }
  }

  setVisibleCard(value: any) {
    if (value.activeStep.stepForm.status === 'INVALID' && value.previousStep.stepForm.status === 'INVALID') {
      this.visibleCard = value.previousStepIndex;
    } else {
      this.visibleCard = value.activeStepIndex;
    }
    // console.log(value);
  }

  createDeliveryLocations() {
    if (this.acquisition) {
      this.acquisition.acquisitionGroups.forEach(group => {
        group.deliveryLocations = [];
        group.items.forEach(item => {
          const locationGroups = this.groupBy.transform(item.desideratum.locations, 'location');
          locationGroups.forEach(locationGroup => {
            const deliveryLocation: DeliveryLocation = new DeliveryLocation();
            deliveryLocation.location = locationGroup.key;
            const deliveryDesideratum = {...item.desideratum};
            deliveryDesideratum.locations = locationGroup.value;
            deliveryLocation.desideratum = deliveryDesideratum;
            deliveryLocation.price = {...item.realPrice};
            group.deliveryLocations.push(deliveryLocation);
          });
        });
      });
      return this.acquisition.acquisitionGroups;
    }
  }
}
