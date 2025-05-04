import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ProductService } from './product.service';
import { Store } from '@ngrx/store';
import { StoreInterface } from './store/app.interface';
import { cartProducts } from './store/actions/cartProducts';
import { selectCartProducts } from './store/selectors/app.selector';
import { CartProduct, CartProductsDetails, Product } from './types';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BackendCartType } from './types/BackendTypes';
import { CartMapper } from './mapping/CartMapper';
import { user } from './store/actions/user';
import { FrontendCartType } from './types/FrontendTypes';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService implements OnInit {
  cartProducts: Observable<CartProduct[]>;
  products: Observable<CartProduct[]> = of([]);
  allProducts: Observable<Product[]>;
  quanitity: Observable<number>;
  baseURL = 'http://localhost:5062/api/cart';
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdCIsIm5hbWVpZCI6IjAzOTI0NzgxLWZiYTItNDE0ZC04MDRkLWEyMmQ3MWUzZTRkMyIsIm5iZiI6MTY3ODE3Nzk4NywiZXhwIjoxNjc4MjY0Mzg3LCJpYXQiOjE2NzgxNzc5ODd9.9O1ExTEZ7CCZ2hnFhaNho-92KxbgEWAfQsrIoafON5I';
  constructor(
    private firestore: AngularFirestore,
    private productService: ProductService,
    private store: Store<StoreInterface>,
    private http: HttpClient
  ) {
    // this.cartId = localStorage.getItem('userCartId');
    this.store.select(selectCartProducts).subscribe((item) => {});
  }
  async ngOnInit() {
    this.allProducts = await this.productService.getAllProducts();
  }

  // call it ,  when user place order
  // public async deleteCart() {
  //   if (this.cartId) {
  //     await this.firestore
  //       .collection('cart')
  //       .doc(this.cartId)
  //       .delete()
  //       .then(() => {
  //         this.cartId &&
  //           this.firestore
  //             .collection('shopping-cart')
  //             .doc(this.cartId)
  //             .delete();
  //         this.store.dispatch(cartProducts({ cartProducts: [] }));
  //         localStorage.removeItem('userCartId');
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }

  // onClick clear cart
  public async clearCart(cartId: string, token: string) {
    const url = this.baseURL + '/clearcart';
    const data = this.http
      .post(url, JSON.stringify(cartId), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => {
          return { status: 200, message: 'cart is cleared' };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );
    return data;
  }

  private createCartProductItem(p: Product, op: string) {
    let cartProduct: CartProductsDetails | null = null;
    let oldProducts: FrontendCartType[] = [];
    this.store.select(selectCartProducts).subscribe((item) => {
      oldProducts = item;
    });
    const idx = oldProducts.findIndex((i) => i.productId === p.productId);
    if (idx >= 0) {
      let qua =
        op === 'increment'
          ? oldProducts[idx].quantity + 1
          : oldProducts[idx].quantity - 1;
      cartProduct = { ...oldProducts[idx], quantity: qua };
    }

    if (cartProduct === null) {
      cartProduct = {
        category: p.category,
        imgURL: p.imgURL,
        price: p.price,
        productId: p.productId,
        title: p.title,
        quantity: 1,
      };
    }

    let updatedProducts = oldProducts.map((i) =>
      i.productId === cartProduct?.productId ? cartProduct : i
    );
    this.store.dispatch(cartProducts({ cartProducts: updatedProducts }));
    return cartProduct;
  }

  public async addProductToCart(cartId: string, p: Product, operation: string) {
    let cartProduct = this.createCartProductItem(p, operation);

    const url = this.baseURL + '/addcart';
    const body = JSON.stringify({
      cartId: cartId,
      productId: cartProduct.productId,
      productName: cartProduct.title,
      productPrice: cartProduct.price,
      categoryName: cartProduct.category,
      productImage: cartProduct.imgURL,
      productQuantity: cartProduct.quantity,
      address: '',
    });

    await this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(map((res) => {}))
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err, 'err');
          return of(err);
        })
      )
      .subscribe(() => {});

    return 1;
  }

  // total cart products from store
  public getCartProductsQuantity() {
    this.store.select(selectCartProducts).subscribe((item) => {
      this.quanitity = of(item.reduce((acc, curr) => acc + curr.quantity, 0));
    });
    return this.quanitity;
  }

  public addProductToCard(cartId: string, p: Product, operation: string) {}

  public async getCart(cartId: string) {
    const url = this.baseURL + '/getcart/' + cartId;
    const data = this.http
      .get(url)
      .pipe(
        map((res) => {
          const r = res as BackendCartType[];
          const details = r.map((i) => CartMapper(i));
          let totalQuantity = details.reduce((acc, curr) => {
            return acc + curr.quantity;
          }, 0);

          this.quanitity = of(totalQuantity);
          return { status: 200, response: details };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );
    return data;
  }
}
