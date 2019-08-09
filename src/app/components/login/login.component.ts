import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {LoginAction} from '../../states/user.state';
import {NavigationUtilService} from '../../services/navigation-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl('admin@admin'),
    password: new FormControl(''),
  });

  constructor(private action: Actions, private  nav: NavigationUtilService, private store: Store) { }
  ngOnInit() {
    this.action.pipe(ofActionCompleted(LoginAction)).subscribe(() => {
      this.nav.navigateToHome();
    });
  }

  signIn() {
    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password.trim();
    this.store.dispatch(new LoginAction(username, password));
}
}
