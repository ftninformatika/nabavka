import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {User} from '../../models/user';
import {Store} from '@ngxs/store';
import {LoginAction} from '../../states/user.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  user: User;
  constructor(private store: Store) { }
  ngOnInit() {
  }

  signIn() {
    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password.trim();
    this.store.dispatch(new LoginAction(username, password));
  }
}
