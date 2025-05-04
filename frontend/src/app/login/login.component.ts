import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Store, select } from '@ngrx/store';
import { UserDetails } from '../types';
import { FrontendUserType } from '../types/FrontendTypes';
import { setUserDetails } from '../helper/utils';
import { StoreInterface } from '../store/app.interface';
import { user } from '../store/actions/user';

export type UserLoginDetails = {
  email: string;
  password: string;
};

export interface UserSignupDetails extends UserDetails {
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private router: Router;
  public errorMessage: string | null = null;
  constructor(
    public auth: AuthService,
    private r: Router,
    private store: Store<StoreInterface>
  ) {
    this.router = r;
  }

  handleLogin(val: UserLoginDetails) {
    this.auth
      .login(val)
      .then((res) => {
        res.subscribe((r) => {
          if (r.status === 401) {
            const err = r as { status: number; message: string };
            this.errorMessage = err.message;
            return;
          } else if (r.status === 200) {
            const res = r as { status: number; response: FrontendUserType };
            const obj = {
              token: res.response.token,
              userName: res.response.userName,
              isAdmin: res.response.isAdmin,
              id: res.response.userID,
              email: res.response.email,
              userID: res.response.userID,
              userAddress: res.response.userAddress,
            } as FrontendUserType;
            setUserDetails(obj);
            this.store.dispatch(user({ user: obj }));
            this.router.navigate(['/']);
            return;
          }
        });
      })
      .catch((err) => {
        console.log(err, 'err');
      });
  }

  ngOnInit(): void {}
}
