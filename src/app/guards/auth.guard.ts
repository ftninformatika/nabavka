import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NavigationUtilService} from '../services/navigation-util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private  nav: NavigationUtilService, private router: Router) {}
  canActivate(): boolean {
    const home = this. nav.getHome();
    if (home === undefined) {
      return true;
    } else {
      this.router.navigate([home]);
      return false;
    }

  }

}
