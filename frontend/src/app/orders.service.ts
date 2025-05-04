import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { StoreInterface } from './store/app.interface';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { OrderMapper } from './mapping/OrderMapper';
import { BackendOrders } from './types/BackendTypes';
import { catchError, map, of } from 'rxjs';
import { FrontendAddressDetails, FrontendOrders } from './types/FrontendTypes';
import { ShoppingCartService } from './shopping-cart.service';
import { cartProducts } from './store/actions/cartProducts';

interface FrontendOrdersInterface extends FrontendOrders {
  address: FrontendAddressDetails;
  userId: string;
  token: string;
}
interface BackendOrdersInterface {
  orderAddress: string;
  userId: string;
  orderDate: string;
  orderItemsReqDtos: {
    productId: string;
    productQuantity: number;
    productPrice: number;
    productImage: string;
    productName: string;
    categoryName: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService implements OnInit {
  baseURL = 'http://localhost:5062/api/order';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private store: Store<StoreInterface>,
    private cart: ShoppingCartService
  ) {}
  ngOnInit(): void {}

  async GetOrders(userId: string, userIsAdmin: boolean) {
    const url = this.baseURL + '/getorders';
    const body = JSON.stringify({
      userId,
      userIsAdmin,
    });
    const data = this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((r) => {
          const data = r as BackendOrders[];
          const res = OrderMapper(data);

          return { status: 200, response: res };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );
    return data;
  }

  async AddOrder(reqObj: FrontendOrdersInterface) {
    const url = this.baseURL + '/addorder';
    const address = [
      reqObj.address.name,
      reqObj.address.addline1,
      reqObj.address.addline2,
      reqObj.address.city,
    ].join(',');
    const productObj = reqObj.products.map((item) => {
      return {
        productId: item.productId,
        productQuantity: item.quantity,
        productPrice: +item.price,
        productImage: item.imgURL,
        productName: item.title,
        categoryName: item.category,
      };
    });
    const body = {
      userId: reqObj.userId,
      orderAddress: address,
      orderDate: reqObj.date,
      orderItemsReqDtos: productObj,
    } as BackendOrdersInterface;
    const data = this.http
      .post(url, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((res) => {
          const r = res as { statusCode: number; message: string };
          if (r.statusCode == 200) {
            return { status: r.statusCode, message: 'order added!' };
          } else {
            return { status: r.statusCode, message: 'something went wrong!' };
          }
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );
    return data;
  }

  // for admin
  async UpdateOrderStatus(status: string, userId: string, orderId: string) {
    const url = this.baseURL + '/updateorder';
    const body = {
      status: status,
      userId,
      orderId,
    };
    return this.http
      .put(url, JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((r) => {
          const res = r as { status: number; message: string };
          return res;
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );
  }
}
