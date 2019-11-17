import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from '../states/user.state';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(UserState.getToken);
    const library = this.store.selectSnapshot(UserState.getLibrary);
    if (token != null) {
      request = request.clone({
        setHeaders: {
          Authorization: token,
          Library: library
        }
      });
    } else if (library != null) { // ovo da bi se omogucio prikaz ponuda za distributera
      request = request.clone({
        setHeaders: {
          Library: library
        }
      });
    }
    return next.handle(request);
  }
}
