import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { Product, newProduct } from 'src/app/types';
import { Store } from '@ngrx/store';
import { StoreInterface } from 'src/app/store/app.interface';
import {
  selectProducts,
  selectUser,
} from 'src/app/store/selectors/app.selector';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  categories: { id: string; name: string }[];
  productId: string | null;
  product: newProduct = { title: '', imgURL: '', category: '', price: '' };
  AuthorizationToken: string | null = null;
  errorMessage: string | null = null;
  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<StoreInterface>
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
    // get product from store
    if (this.productId) {
      this.getProductById(this.productId);
    }
  }
  async ngOnInit() {
    this.store.select(selectUser).subscribe((u) => {
      this.AuthorizationToken = u?.token || null;
    });
    await this.productService.getAllProducts();
    await this.productService
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
  async save(product: Product) {
    if (product.title.trim().length <= 0 || product.imgURL.trim().length <= 0) {
      console.log('provide valid product details');

      return;
    }
    if (this.AuthorizationToken == null) {
      console.log('user do not have access for it');
      return;
    }
    //  update product
    if (this.productId) {
      await this.productService
        .updateProduct(product, this.productId, this.AuthorizationToken)
        .then((res) => {
          res.subscribe((r) => {
            const data = r as { status: number; message: string };
            if (data.status == 200) {
              console.log(data.message);
              this.router.navigate(['/admin/products']);
            } else {
              console.log(data.message);
              this.errorMessage = data.message;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // create new product
    else {
      await this.productService
        .create(product, this.AuthorizationToken)
        .then((res) => {
          res.subscribe((r) => {
            const data = r as { status: number; message: string };
            if (data.status == 200) {
              console.log(data.message);
              this.router.navigate(['/admin/products']);
            } else {
              this.errorMessage = data.message;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // TODO update table task is pending
  }

  async delete() {
    const isConfirm = confirm('Are you want to delete this product');
    if (this.productId && isConfirm) {
      if (this.AuthorizationToken == null) {
        console.log('Only admin have rights to delete a product');
        return;
      }
      await this.productService
        .deleteProduct(this.productId, this.AuthorizationToken)
        .then((res) => {
          res.subscribe((r) => {
            const data = r as { status: number; message: string };
            if (data.status == 200) {
              console.log(data.message);
              this.router.navigate(['/admin/products']);
            } else {
              console.log(data.message);
              this.errorMessage = data.message;
            }
          });
        });
    }
  }

  getAllCategories() {
    return this.categories;
  }

  getProductById(productId: string) {
    this.store.select(selectProducts).subscribe((item) => {
      const idx = item.findIndex((i) => i.productId === productId);
      if (idx >= 0) {
        const p = item[idx];
        this.product = {
          ...this.product,
          title: p.title,
          imgURL: p.imgURL,
          category: p.category,
          price: p.price,
        };
      }
    });
  }
}
