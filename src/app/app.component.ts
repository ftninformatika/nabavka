import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {LogoutAction, UserState} from './states/user.state';
import {Select, Store} from '@ngxs/store';
import {Roles} from './configs/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Select(UserState) loggeduser;
  public Roles = Roles;
  constructor(private router: Router, private store: Store) {
  }
  logout() {
    this.store.dispatch(new LogoutAction());
    this.router.navigate(['']);
  }

}
