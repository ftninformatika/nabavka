import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {LogoutAction, UserState} from './states/user.state';
import {Store} from '@ngxs/store';
import {Roles} from './configs/app.config';
import {User} from './models/user';
import {Observable} from 'rxjs';
import {ModalDirective} from 'ng-uikit-pro-standard';
import {Desideratum} from './models/desideratum';
import {AcquisitionService} from './services/acquisition.service';
import {ReportService} from "./services/report.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  public Roles = Roles;
  public loggeduser: Observable<User> = this.store.select(UserState.userDetails);
  private year = 2019;
  @ViewChild('modalReportForm', {static: false}) modalReportForm: ModalDirective;
  constructor(private router: Router, private store: Store, public reportService: ReportService) {
  }
  logout() {
    this.store.dispatch(new LogoutAction());
    this.router.navigate(['']);
  }

  ngOnInit(): void {
  }

  showReport() {
    this.reportService.createFinalReport(this.year).subscribe(pdf => {
      const anchor = document.createElement('a');
      anchor.download = 'Izvestaj-' + this.year + '.pdf';
      const url = window.URL.createObjectURL(pdf);
      anchor.href = url;
      anchor.click();
    });
  }
}

