import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StoreInterface } from './store/app.interface';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  public userExist: Observable<boolean>;
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    if (this.auth.user$) {
      const url = this.router.url;
      this.auth.user$.subscribe((user) => {
        if (user) {
          // this.auth.getUser(user.uid); TODO
          return (this.userExist = of(true));
        }
        this.router.navigate(['/login']);
        return (this.userExist = of(false));
      });
    }
    return this.userExist;
  }
}
