import {User} from '../models/user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {FirebaseService} from '../services/firebase.service';
import {Router} from '@angular/router';
import {NavigationUtilService} from '../services/navigation-util.service';



export class LoginAction {
  static readonly type = '[Login Page] getUser';
  public username: string;
  public password: string;

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
export class LogoutAction {
  static readonly type = '[Auth] Logout';
}
export interface IAuthUser {
  user: User;
}
@State<IAuthUser>({
  name: 'USER_STATE',
  defaults: { user: null}
})
export class UserState {


  @Selector()
  public static getRole(state: IAuthUser) {
    if (state.user && state.user.role) {
      return state.user.role;
    }
    return null;
  }
  @Selector()
  public static userDetails(state: IAuthUser) {
    return state.user;
  }

  constructor(private firebaseService: FirebaseService, private router: Router, private  nav: NavigationUtilService) {}


  @Action(LoginAction)
  public signIn(ctx: StateContext<IAuthUser>, action: LoginAction) {
    try {
      this.firebaseService.getUser(action.username, action.password).subscribe(
          value => {
            const response = value.map(e => {
              return {
                ...e.payload.doc.data()
              };
            })[0] as User;
            this.nav.navigateToHome();
            ctx.patchState({
              user: response
            });

          });
    } catch (e) {
      console.log('error during login action');
    }
  }
  @Action([LogoutAction])
  public signOut(ctx: StateContext<IAuthUser>) {
    ctx.setState({user: undefined});
  }


}

