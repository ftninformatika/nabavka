import {Component, OnInit} from '@angular/core';
import {Acquisition, Status} from '../../models/acquisition';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';
import {AcquisitionService} from '../../services/acquisition.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  acquisitionList: Acquisition[] = [];
  Status = Status;

  constructor(private acquisitionService: AcquisitionService, private router: Router) { }

  ngOnInit() {
    this.acquisitionService.getAcquisitionList().subscribe(data => {
      this.acquisitionList = data;
    });
  }

  calculateAmount(acquisition: Acquisition) {
    let amount = 0;
    acquisition.acquisitionGroups.forEach(group => {
      group.items.forEach(item => {
        let locNo = 0;
        if (item.desideratum.locations) {
          for (const location of item.desideratum.locations) {
            locNo = locNo + location.amount;
          }
        }
        if (acquisition.status === Status.OPEN) {
          amount = amount + locNo * item.planedPrice.price;
        } else {
         // amount = amount + locNo * item.realPrice.price;
          amount = amount + locNo * item.planedPrice.price;
        }
      });
    });
    return amount;
  }

  addAcquisition(form: any, modalInstance: any) {
    const acquisition: Acquisition = {
      title: form[0].value,
      budget: form[1].value,
      startDate: new Date(),
      status: Status.OPEN,
      desiderataUpdated: false,
      acquisitionGroups: []
    };
    this.acquisitionService.addAcquisition(acquisition).subscribe(data => {
      acquisition.id = data;
      this.router.navigate(['/acquisition/' + acquisition.id]);
    });
    this.acquisitionList.splice(0, 0, acquisition);
    form.reset();
    modalInstance.hide();
  }
}
