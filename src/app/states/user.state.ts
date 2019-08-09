import {User} from '../models/user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {FirebaseService} from '../services/firebase.service';
import {tap} from 'rxjs/operators';

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
 userLogged: any;

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

  constructor(private firebaseService: FirebaseService) {}


  @Action(LoginAction)
  public signIn(ctx: StateContext<IAuthUser>, action: LoginAction) {
    return this.firebaseService.getUser(action.username, action.password).pipe(tap((value) => {
      this.userLogged = value.docs.map(e => {
        return {
          ...e.data()
        };
      })[0] as User;
      ctx.patchState({user: this.userLogged} );
    }));
  }
  @Action([LogoutAction])
  public signOut(ctx: StateContext<IAuthUser>) {
    ctx.patchState({user: undefined});
  }

}

