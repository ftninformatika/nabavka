import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import {NavigationUtilService} from '../services/navigation-util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private  nav: NavigationUtilService) {}
  canActivate(): boolean {
    return this.nav.navigateToHome();

  }

}
