import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User, UserDetails } from './types';
import { Store } from '@ngrx/store';
import { StoreInterface } from './store/app.interface';
import { user } from './store/actions/user';
import { UserLoginDetails } from './login/login.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BackendUserType } from './types/BackendTypes';
import { getUserDetails, setUserDetails } from './helper/utils';
import { UsertMapper } from './mapping/UserMapper';
import { FrontendUserType } from './types/FrontendTypes';
import { cartProducts } from './store/actions/cartProducts';
import { selectUser } from './store/selectors/app.selector';

interface UserSignupDetails extends UserDetails {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private router: Router;
  public user$: Observable<FrontendUserType | null>;
  baseURL = 'http://localhost:5062/api/user';
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<StoreInterface>,
    private http: HttpClient,
    r: Router
  ) {
    this.router = r;
  }
  ngOnInit() {
    const userData = getUserDetails();
    if (userData) {
      this.store.dispatch(
        user({
          user: userData,
        })
      );
    }
  }
  async login(val: UserLoginDetails) {
    const url = this.baseURL + '/login';
    let response: BackendUserType | null = null;
    let error = null as { status: number; message: string } | null;
    const body = JSON.stringify({
      userEmail: val.email,
      password: val.password,
    });
    const data = this.http
      .post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((data) => {
          response = data as BackendUserType;
          const userDetails = UsertMapper(response);
          return { status: 200, response: userDetails };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          error = { status: err.status, message: err.error };
          return of(error);
        })
      );

    return data;
  }
  async getUser() {
    this.store.select(selectUser).subscribe((res) => {
      if (res) {
        this.user$ = of(res);
        return;
      }
      const userData = getUserDetails();
      if (userData) {
        this.store.dispatch(
          user({
            user: userData,
          })
        );
      }
      this.user$ = of(userData);
    });
    return this.user$;
  }

  logout() {
    localStorage.removeItem('auth');
    this.store.dispatch(user({ user: null }));
    this.store.dispatch(cartProducts({ cartProducts: [] }));
    this.user$ = of(null);
  }

  // for create new user
  async signup(details: UserSignupDetails) {
    const url = this.baseURL + '/register';
    const body = JSON.stringify({
      userEmail: details.email.trim(),
      password: details.password.trim(),
      userName: details.userName.trim(),
      userRole: details.userType,
    });
    const data = this.http
      .post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((data) => {
          const d = data as { id: string; token: string; userName: string };
          const res = {
            Token: d.token,
            Id: d.id,
            UserName: d.userName,
            UserEmail: details.email,
            UserType: details.userType,
          } as BackendUserType;

          const userDetails = UsertMapper(res);
          return { status: 200, response: userDetails };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: 406, message: err.error });
        })
      );
    return data;
  }

  async updateUser(userId: string, token: string, address: string) {
    const url = this.baseURL + '/updateuser';
    const body = JSON.stringify({ userId, address });
    const data = this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => {
          const r = res as { status: number; message: string };
          return { status: 200, message: r.message };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const error = { status: err.status, message: err.error };
          return of(error);
        })
      );
    return data;
  }
}
