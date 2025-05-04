import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ProductService } from 'src/app/product.service';
import { Subject } from 'rxjs';
import { Product } from 'src/app/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  // for data table
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe(() => {}); // intiate our data table
  }

  async ngOnInit() {
    this.products$ = await this.productService.getAllProducts();
    this.filteredProducts$ = this.products$;
    this.filteredProducts$.subscribe((res) => {
      this.dtTrigger.next(of(res));
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  filterProducts(val: string) {
    if (val.length > 0) {
      this.filteredProducts$ = this.products$.pipe(
        map((p) => p.filter((item) => item.title.includes(val)))
      );
    } else {
      this.filteredProducts$ = this.products$;
    }
  }
}
