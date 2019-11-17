import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {LoginAction, LogoutAction, UserState} from '../../states/user.state';
import {NavigationUtilService} from '../../services/navigation-util.service';
import {ToastService} from 'ng-uikit-pro-standard';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    username: new FormControl('admin@bgb'),
    password: new FormControl('samo mi'),
  });

  // tslint:disable-next-line:max-line-length
  constructor(private action: Actions, private router: Router, private  nav: NavigationUtilService, private store: Store, private  toast: ToastService) { }
  ngOnInit() {
    this.action.pipe(ofActionCompleted(LoginAction)).subscribe(res => {
          if (res.result.error) {
            this.toast.error('Грешка при пријављивању корисника!');
          } else {
            const user = this.store.selectSnapshot(UserState.userDetails);
            if (user == null) {
              this.toast.error('Погрешно корисничко име или лозинка.', '', {opacity: 1});
            } else {
              const home = this.nav.getHome();
              if (home === undefined) {
                this.store.dispatch(new LogoutAction());
                this.toast.warning('Немате право приступа овој апликацији.', '', {opacity: 1});
              } else {
                this.router.navigate([home]);
              }
            }
          }
    });
  }

  signIn() {
    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password.trim();
    this.store.dispatch(new LoginAction(username, password));
}
}
