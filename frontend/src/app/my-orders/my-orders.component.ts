import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AddressDetails,
  CartProduct,
  CartProductsDetails,
  Orders,
  Product,
} from '../types';
import { StoreInterface } from '../store/app.interface';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';
import {
  selectCartProducts,
  selectProducts,
} from '../store/selectors/app.selector';
import { OrdersService } from '../orders.service';
import { FrontendOrders, FrontendUserOrders } from '../types/FrontendTypes';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  cartProductsDetails: Observable<CartProductsDetails[]> = of([]);
  totalAmount: Observable<number> = of(0);
  quantity: Observable<number> = of(0);
  userId: string | null = null;
  token: string | null = null;
  isAdmin: boolean = false;
  address: AddressDetails;
  ordersDetails: Observable<FrontendUserOrders[]>;
  constructor(
    private store: Store<StoreInterface>,
    private auth: AuthService,
    private orders: OrdersService
  ) {
    let products: Product[] = [];
    this.store.select(selectProducts).subscribe((item) => {
      products = item;
    });
    this.auth.user$.subscribe((item) => {});
    this.showCartProducts();
  }
  ngOnInit(): void {
    this.auth.getUser().then((res) => {
      res.subscribe((r) => {
        if (r?.userID) {
          this.userId = r.userID;
          this.isAdmin = r.isAdmin;
          this.getOrdersDetails(this.userId, this.isAdmin);
        }
      });
    });
  }

  getOrdersDetails(userId: string, isAdmin: boolean) {
    this.orders.GetOrders(userId, isAdmin).then((res) => {
      res.subscribe((r) => {
        if (r.status === 200) {
          const data = r as { status: number; response: FrontendOrders[] };

          const details: FrontendUserOrders[] = data.response.map((item) => {
            const total = item.products.reduce(
              (acc, obj) => acc + +obj.price * obj.quantity,
              0
            );
            return {
              totalAmount: total,
              address: item.address,
              date: item.date,
              status: item.status,
              products: item.products.filter((p) => p.quantity > 0),
            };
          });
          this.ordersDetails = of(details);
        } else {
          const data = r as { status: number; message: string };
          console.log(data, 'err');
        }
      });
    });
  }

  public showCartProducts() {
    let cartProductsArr: CartProduct[] = [];
    let cartProductsDetailsArr: CartProductsDetails[] = [];
    let allProductsArr: Product[] = [];
    this.store.select(selectCartProducts).subscribe((item) => {
      cartProductsArr = item
        .map((val) => val)
        .filter((val) => val.quantity > 0);
    });
    this.store.select(selectProducts).subscribe((item) => {
      allProductsArr = item.map((val) => val);
    });
    if (cartProductsArr.length <= 0) {
      this.totalAmount = of(0);
      this.cartProductsDetails = of([]);
      return; // sopping cart is empty
    }
    allProductsArr.map((pItem) => {
      const idx = cartProductsArr.findIndex(
        (cItem) => cItem.productId === pItem.productId
      );
      if (idx >= 0) {
        cartProductsDetailsArr.push({
          ...pItem,
          quantity: cartProductsArr[idx].quantity,
        });
      }
    });
    let total = cartProductsDetailsArr.reduce(
      (acc, curr) => acc + +curr.price * curr.quantity,
      0
    );

    this.totalAmount = of(total);
    this.cartProductsDetails = of(cartProductsDetailsArr);
  }
}
