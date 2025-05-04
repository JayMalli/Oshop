import { Injectable, OnInit } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { products } from './store/actions/products';

import { StoreInterface } from './store/app.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProductMapper } from './mapping/ProductMapper';
import { BackendCategoryType, BackendProductType } from './types/BackendTypes';
import { CategorytMapper } from './mapping/CategortyMapper';
import { FrontendNewProduct, FrontendProduct } from './types/FrontendTypes';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnInit {
  products: Observable<FrontendProduct[]> = of([]);
  baseURL = 'http://localhost:5062/api/products';
  constructor(private store: Store<StoreInterface>, private http: HttpClient) {}
  async ngOnInit() {}

  // get product list from store
  async getAllProducts(): Promise<Observable<FrontendProduct[]>> {
    const data = this.http.get(this.baseURL + '/getproducts').pipe((data) => {
      return data as Observable<BackendProductType[]>;
    });

    const result = data.pipe(map((d) => d.map((item) => ProductMapper(item))));

    result.subscribe((productsData) => {
      this.store.dispatch(products({ products: productsData })); // store the products data in details
    });
    return result;
  }

  // get categories list
  async geAllCategories() {
    const url = this.baseURL + '/getcategories';
    const result = this.http
      .get(url)
      .pipe(
        map((res) => {
          const data = res as BackendCategoryType[];
          return {
            status: 200,
            response: data.map((item) => CategorytMapper(item)),
          };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );

    return result;
  }

  // ------------ Product operations [by admin] --------

  // add new product
  async create(product: FrontendNewProduct, token: string) {
    const url = this.baseURL + '/addproduct';
    const body = JSON.stringify({
      categoryId: product.category,
      productName: product.title,
      productPrice: +product.price,
      productIMG: product.imgURL,
    });
    const data = this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      .pipe(
        map(() => {
          return {
            status: 200,
            message: 'product added successfully!',
          };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );

    return data;
  }

  // update existing product details
  async updateProduct(product: FrontendProduct, id: string, token: string) {
    const url = this.baseURL + '/updateproduct';
    const body = JSON.stringify({
      categoryId: product.category,
      productId: id,
      productName: product.title,
      productPrice: product.price,
      productIMG: product.imgURL,
    });
    const data = this.http
      .put(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map(() => {
          return { status: 200, message: 'product added successfully!' };
        })
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return of({ status: err.status, message: err.error });
        })
      );

    return data;
  }

  // delete existing product
  async deleteProduct(id: string, token: string) {
    const url = this.baseURL + '/deleteproduct/' + id;
    const data = this.http
      .delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map(() => {
          return { status: 200, message: 'product deleted successfully!' };
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
