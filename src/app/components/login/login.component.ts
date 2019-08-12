import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {LoginAction, UserState} from '../../states/user.state';
import {NavigationUtilService} from '../../services/navigation-util.service';
import {ToastService} from 'ng-uikit-pro-standard';

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

  constructor(private action: Actions, private  nav: NavigationUtilService, private store: Store, private  toast: ToastService) { }
  ngOnInit() {
    this.action.pipe(ofActionCompleted(LoginAction)).subscribe(res => {
          if (res.result.error) {
            this.toast.error('Грешка при пријављивању корисника!');
          } else {
            const user = this.store.selectSnapshot(UserState.userDetails);
            if (user == null) {
              this.toast.error('Погрешно корисничко име или лозинка.', '', {opacity: 1});
            }
            this.nav.navigateToHome();
          }
    });
  }

  signIn() {
    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password.trim();
    this.store.dispatch(new LoginAction(username, password));
}
}
