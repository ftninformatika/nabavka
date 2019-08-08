import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {UserState} from '../states/user.state';
import {Roles} from '../configs/app.config';

@Injectable({
  providedIn: 'root'
})
export class DesiderataGuard implements CanActivate {

  constructor(private router: Router, private store: Store) {
  }

  canActivate() {
    const userrole = this.store.selectSnapshot(UserState.getRole);
    if (userrole === Roles.ACQUISITION_MANAGER || userrole === Roles.DESIDERATUM_MANAGER) {
      return true;
    } else {
      this.router.navigate(['access-denied']);
      return false;
    }
  }
}
