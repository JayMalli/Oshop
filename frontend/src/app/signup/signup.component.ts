import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Store, select } from '@ngrx/store';
import { selectRootState } from '../store/selectors/app.selector';
import { Product, UserDetails } from '../types';
import { setUserDetails } from '../helper/utils';
import { FrontendUserType } from '../types/FrontendTypes';
import { StoreInterface } from '../store/app.interface';
import { user } from '../store/actions/user';

export interface DataProps {
  email: string;
  displayName: string;
}

export interface UserSignupDetails extends UserDetails {
  password: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  private router: Router;
  private userDetails: UserSignupDetails | null = null;
  public errorMessage: string | null = null;
  constructor(
    public auth: AuthService,
    private store: Store<StoreInterface>,
    r: Router
  ) {
    this.router = r;
  }

  ngOnInit(): void {}

  handleSubmit(details: UserSignupDetails) {
    this.auth
      .signup(details)
      .then((res) => {
        res.subscribe((r) => {
          if (r.status === 406) {
            const err = r as { status: number; message: string };
            this.errorMessage = err.message;
          } else if (r.status === 200) {
            const details = r as { status: number; response: FrontendUserType };
            setUserDetails(details.response);
            this.store.dispatch(user({ user: details.response }));
            this.router.navigate(['/']);
          } else {
            const err = r as { status: number; message: string };
            this.errorMessage = err.message;
          }
        });
      })
      .catch((err) => console.log(err));
  }
}
