import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, map, of, pipe } from 'rxjs';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../types';
import { ShoppingCartService } from '../shopping-cart.service';
import { FrontendCartType } from '../types/FrontendTypes';
import { cartProducts } from '../store/actions/cartProducts';
import { Store } from '@ngrx/store';
import { StoreInterface } from '../store/app.interface';
import { AuthService } from '../auth.service';
import { selectProducts, selectUser } from '../store/selectors/app.selector';
import { user } from '../store/actions/user';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  allProducts: Product[];
  categories: { id: string; name: string }[];
  category: string | null;
  cartId: string | null;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: ShoppingCartService,
    private auth: AuthService,
    private store: Store<StoreInterface>
  ) {}
  async ngOnInit() {
    this.store.select(selectUser).subscribe((u) => {
      if (u) {
        console.log('user found');
        return;
      }
      this.auth.getUser().then((res) => {
        res.subscribe((r) => {
          if (r) {
            this.store.dispatch(user({ user: r }));
          }
        });
      });
    });
    this.getProductsDetails();
    // filter products at initially
    // get categories list
    this.productService
      .geAllCategories()
      .then((res) => {
        res.subscribe((r) => {
          if (r.status === 200) {
            const data = r as {
              status: number;
              response: { id: string; name: string }[];
            };
            this.categories = data.response;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getProductsDetails() {
    this.store.select(selectProducts).subscribe((pro) => {
      if (pro.length <= 0) {
        this.productService
          .getAllProducts()
          .then((res) => {
            this.products$ = res;
            this.filteredProducts$ = res;
            res.pipe(map((proDetails) => (this.allProducts = proDetails)));
            this.FilteredProductsOnCategoryChange();
          })
          .catch((err) => console.log(err));
      } else {
        this.products$ = of(pro);
        this.filteredProducts$ = of(pro);
      }
    });
  }

  FilteredProductsOnCategoryChange() {
    this.route.queryParamMap.subscribe((params) => {
      this.products$.subscribe((p) => {});
      this.category = params.get('category');
      if (this.category) {
        this.filteredProducts$ = this.products$.pipe(
          map((pro) =>
            pro.filter(
              (i) => i.category.toLowerCase() === this.category?.toLowerCase()
            )
          )
        );
        this.filteredProducts$.subscribe((f) => {});
        return;
      }
      this.filteredProducts$ = this.products$;
    });
  }
}
