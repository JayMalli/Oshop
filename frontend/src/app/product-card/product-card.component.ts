import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Store } from '@ngrx/store';
import { StoreInterface } from '../store/app.interface';
import { selectCartProducts } from '../store/selectors/app.selector';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { FrontendCartType, FrontendProduct } from '../types/FrontendTypes';
import { cartProducts } from '../store/actions/cartProducts';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: FrontendProduct;
  @Input('show-actions') showActions = true;
  quantity: number;
  cartId: string | null = null;
  quantuty: Observable<number> = of(0);
  constructor(
    private cartService: ShoppingCartService,
    private store: Store<StoreInterface>,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.getUser().then((res) => {
      res.subscribe((r) => {
        if (r) {
          this.cartId = r.userID;
          this.getCartProducts(this.cartId);
        }
      });
    });
    this.getSingleProuctQuantity();
  }

  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
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

            this.store.dispatch(cartProducts({ cartProducts: data.response }));
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getSingleProuctQuantity() {
    this.store.select(selectCartProducts).subscribe((item) => {
      item.map((i) => {
        if (i?.productId === this.product?.productId) {
          this.quantuty = of(i.quantity);
        }
      });
    });

    return this.quantuty;
  }

  addToCart(p: FrontendProduct, operation?: string) {
    if (this.cartId) {
      const op = operation ? operation : 'increment';
      this.getSingleProuctQuantity();
      this.cartService.addProductToCart(this.cartId, p, op).then((res) => {
        this.getSingleProuctQuantity();
      });
    }
    return;
  }
}
