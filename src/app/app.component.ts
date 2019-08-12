import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {LogoutAction, UserState} from './states/user.state';
import {Select, Store} from '@ngxs/store';
import {Roles} from './configs/app.config';
import {User} from './models/user';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  public Roles = Roles;
  loggeduser: Observable<User>;
  constructor(private router: Router, private store: Store) {
  }
  logout() {
    this.store.dispatch(new LogoutAction());
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.loggeduser = this.store.select(UserState.userDetails);
  }

}
