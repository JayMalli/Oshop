import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreInterface } from '../store/app.interface';
import { selectCartProducts } from '../store/selectors/app.selector';
import { AuthService } from '../auth.service';
import { cartProducts } from '../store/actions/cartProducts';
import {
  FrontendAddressDetails,
  FrontendCartType,
  FrontendOrders,
} from '../types/FrontendTypes';
import { OrdersService } from '../orders.service';
import { ShoppingCartService } from '../shopping-cart.service';

interface FrontendOrdersInterface extends FrontendOrders {
  address: FrontendAddressDetails;
  userId: string;
  token: string;
}

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit {
  cartProducts: Observable<FrontendCartType[]> = of([]);
  totalAmount: Observable<number> = of(0);
  quantity: Observable<number> = of(0);
  userId: string | null = null;
  cartId: string | null = null;
  token: string | null = null;
  address: FrontendAddressDetails = {
    name: '',
    addline1: '',
    addline2: '',
    city: '',
  };
  constructor(
    private router: Router,
    private store: Store<StoreInterface>,
    private auth: AuthService,
    private orderService: OrdersService,
    private cart: ShoppingCartService
  ) {}
  ngOnInit(): void {
    this.auth.getUser().then((res) => {
      res.subscribe((r) => {
        if (r?.userID) {
          this.userId = r.userID;
          this.cartId = r.userID;
          this.token = r.token;
          if (r.userAddress?.length > 0) {
            const details = r.userAddress.split(',');
            const addressDetails: FrontendAddressDetails = {
              name: details[0],
              addline1: details[1],
              addline2: details[2],
              city: details[3],
            };
            this.address = addressDetails;
          }
        }
      });
    });
    this.store.select(selectCartProducts).subscribe((data) => {
      this.cartProducts = of(data);
      this.totalAmount = of(
        data.reduce((acc, obj) => acc + +obj.price * obj.quantity, 0)
      );
      this.quantity = of(data.reduce((acc, obj) => acc + obj.quantity, 0));
    });
  }

  save(val: FrontendAddressDetails) {
    this.cartProducts.subscribe((item) => {
      if (item.length > 0) {
        this.saveOrder(val, item);
      }
    });
  }
  saveOrder(address: FrontendAddressDetails, productsData: FrontendCartType[]) {
    if (
      address.addline1.trim().length <= 0 ||
      address.addline2.trim().length <= 0 ||
      address.name.trim().length <= 0 ||
      address.city.trim().length <= 0
    ) {
      console.log('provide valid details');
      return;
    }
    if (this.userId) {
      const reqObj = {
        userId: this.userId,
        address: address,
        date: new Date().toISOString(),
        products: productsData,
        token: this.token,
      } as FrontendOrdersInterface;
      this.orderService
        .AddOrder(reqObj)
        .then((res) => {
          res.subscribe((r) => {
            if (r.status === 200) {
              const cartId = reqObj.userId;
              const token = reqObj.token;
              const data = r as { status: number; message: string };
              this.cart.clearCart(cartId, token).then((res) => {
                res.subscribe((r) => {
                  if (r.status == 200) {
                    this.store.dispatch(cartProducts({ cartProducts: [] }));
                    void this.router.navigate(['/order-success']);
                  }
                });
              });
              console.log(data.message);
            }
          });
        })
        .catch((e) => {
          console.log(e, 'e');
        });
    }
  }
}
