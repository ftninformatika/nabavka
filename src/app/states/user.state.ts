import {User} from '../models/user';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {RestApiService} from '../services/rest-api.service';

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
export class DistributorSetupAction {
  static readonly type = '[Distributor] LibrarySetup';
  public library: string;
  public role: string;

  public constructor(library: string, role: string) {
    this.library = library;
    this.role = role;
  }
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
  public static getToken(state: IAuthUser) {
    if (state.user && state.user.token) {
      return state.user.token;
    }
    return null;
  }

  @Selector()
  public static getLibrary(state: IAuthUser) {
    if (state.user && state.user.library) {
      return state.user.library;
    }
    return null;
  }
  @Selector()
  public static userDetails(state: IAuthUser) {
    return state.user;
  }

  constructor(private restApi: RestApiService) {}


  @Action(LoginAction)
  public signIn(ctx: StateContext<IAuthUser>, action: LoginAction) {
    let userLogged: any;
    try {
      return this.restApi.login(action.username, action.password).pipe(tap((value) => {
        userLogged = value;
        ctx.patchState({user: userLogged} );
      }));
    } catch (e) {
      ctx.patchState({user: null} );
      console.log(e);
    }

  }
  @Action([LogoutAction])
  public signOut(ctx: StateContext<IAuthUser>) {
    ctx.patchState({user: undefined});
  }

  @Action([DistributorSetupAction])
  public addLibrary(ctx: StateContext<IAuthUser>, action: DistributorSetupAction) {
    const distributor: User = {};
    distributor.library = action.library;
    distributor.role = action.role;
    ctx.patchState({user: distributor});
  }

}

