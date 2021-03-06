import {Injectable } from '@angular/core';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {UserState} from '../states/user.state';
import {configs, Roles} from '../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class NavigationUtilService {

  constructor(private store: Store, private router: Router) { }

  public getHome() {
    const role = this.store.selectSnapshot(UserState.getRole);
    if (role === Roles.ACQUISITION_MANAGER) {
      return configs.adminHomePage;
    } else if (role === Roles.DESIDERATUM_MANAGER) {
      return configs.librarianHomePage;
    } else {
      return undefined;
    }
  }
}
