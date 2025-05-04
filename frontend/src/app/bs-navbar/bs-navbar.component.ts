import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { User } from '../types';
import { Router } from '@angular/router';
import { FrontendCartType } from '../types/FrontendTypes';
import { StoreInterface } from '../store/app.interface';
import { Store } from '@ngrx/store';
import { cartProducts } from '../store/actions/cartProducts';
import { selectUser } from '../store/selectors/app.selector';
import { user } from '../store/actions/user';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css'],
})
export class BsNavbarComponent implements OnInit {
  arr: Observable<number>;
  user: Observable<User | null>;
  private router: Router;
  constructor(
    public auth: AuthService,
    private cartService: ShoppingCartService,
    r: Router,
    private store: Store<StoreInterface>
  ) {
    this.router = r;
  }
  ngOnInit() {
    this.store.select(selectUser).subscribe((u) => {
      if (u) {
        console.log('user found');
        this.user = of(u);
        return;
      }
      this.auth.getUser().then((res) => {
        console.log('get user called');
        res.subscribe((r) => {
          if (r) {
            this.store.dispatch(user({ user: r }));
            this.getCartProducts(r.userID);
            this.getQuantity();
          }
        });
      });
    });
  }

  logOut() {
    this.auth.logout();
    this.user = of(null);
  }

  getCartProducts(cartId: string) {
    this.cartService.getCart(cartId).then((res) => {
      res.subscribe((r) => {
        if (r.status === 200) {
          const data = r as { status: number; response: FrontendCartType[] };
          this.store.dispatch(cartProducts({ cartProducts: data.response }));
        }
      });
    });
  }

  getQuantity() {
    return this.cartService.getCartProductsQuantity();
  }
}
