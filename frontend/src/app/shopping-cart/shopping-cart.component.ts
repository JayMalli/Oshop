import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Observable, map, of } from 'rxjs';
import { ProductService } from '../product.service';
import { CartProductsDetails, Product } from '../types';
import { Store } from '@ngrx/store';
import { StoreInterface } from '../store/app.interface';
import { user } from '../store/actions/user';
import { FrontendCartType } from '../types/FrontendTypes';
import { cartProducts } from '../store/actions/cartProducts';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartProductsDetails: Observable<CartProductsDetails[]> = of([]);
  totalAmount: Observable<number> = of(0);
  quanitity: Observable<number> = of(0);
  cartId: string | null;
  token: string | null;

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private store: Store<StoreInterface>
  ) {}
  async ngOnInit() {
    this.authService.getUser().then((res) => {
      res.subscribe((r) => {
        if (r) {
          this.cartId = r.userID;
          this.token = r.token;
          this.getCartProducts(this.cartId);
        }
      });
    });
  }

  private async getCartProducts(cartID: string) {
    await this.cartService
      .getCart(cartID)
      .then((res) => {
        res.subscribe((r) => {
          if (r.status === 200) {
            const data = r as { status: number; response: FrontendCartType[] };

            let totalQuantity = data.response.reduce((acc, curr) => {
              return acc + curr.quantity;
            }, 0);
            let totalAmount = data.response.reduce((acc, curr) => {
              return acc + curr.quantity * +curr.price;
            }, 0);
            this.quanitity = of(totalQuantity);
            this.totalAmount = of(totalAmount);
            this.cartProductsDetails = of(
              data.response.filter((i) => i.quantity > 0)
            );

            this.store.dispatch(cartProducts({ cartProducts: data.response }));
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public clearCart() {
    if (this.cartId == null || this.token == null) {
      console.log('provide cartId or token');
      return;
    }
    this.cartService.clearCart(this.cartId, this.token).then((res) => {
      res.subscribe((r) => {
        if (r.status === 200) {
          this.cartProductsDetails = of([]);
          this.totalAmount = of(0);
          this.quanitity = of(0);
          this.store.dispatch(cartProducts({ cartProducts: [] }));
        }
      });
    });
    return;
  }

  public isDisabled() {
    let result = false;
    this.totalAmount.subscribe((val) =>
      val > 0 ? (result = true) : (result = false)
    );
    return result;
  }
}
