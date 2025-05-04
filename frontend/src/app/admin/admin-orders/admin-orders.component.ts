import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { OrdersService } from 'src/app/orders.service';
import {
  FrontendAdminOrders,
  FrontendOrders,
  Orders,
} from 'src/app/types/FrontendTypes';
export type OrdersData = {
  userId: string;
  orders: Orders[];
};

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit, AfterContentChecked {
  public ordersData: Observable<OrdersData[]>;
  public userId: string;
  public isAdmin: boolean;
  constructor(
    private firestore: AngularFirestore,
    private changeDetector: ChangeDetectorRef,
    private orders: OrdersService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.getUser().then((res) => {
      res.subscribe((r) => {
        if (r?.userID) {
          this.userId = r.userID;
          this.isAdmin = r.isAdmin;
          this.orders
            .GetOrders(this.userId, this.isAdmin)
            .then((res) => {
              res.subscribe((r) => {
                if (r.status === 200) {
                  const data = r as {
                    status: number;
                    response: FrontendOrders[];
                  };
                  this.getAllOrders(data.response);
                } else {
                }
              });
            })
            .catch((err) => {
              console.log(err, 'err');
            });
        }
      });
    });
  }
  ngAfterContentChecked() {
    this.changeDetector.detectChanges();
  }
  getAllOrders(details: FrontendOrders[]) {
    let arr = [] as FrontendAdminOrders[];

    details.map((item) => {
      const isExist = arr.findIndex((i) => i.userId === item.userId);
      const total = item.products.reduce(
        (curr, obj) => curr + +obj.price * obj.quantity,
        0
      );

      if (isExist >= 0) {
        const order = {
          address: item.address,
          date: item.date,
          orderId: item.orderId,
          status: item.status,
          totalAmount: total,
          products: item.products,
        } as Orders;
        arr[isExist].orders.push(order);
      } else {
        const order = {
          address: item.address,
          date: item.date,
          orderId: item.orderId,
          status: item.status,
          totalAmount: total,
          products: item.products,
        } as Orders;
        arr.push({ userId: item.userId, orders: [order] });
      }
    });
    this.ordersData = of(arr);
    return arr;
  }

  handleChange(status: string, userId: string, orderId: string) {
    if (status && userId && orderId) {
      this.orders
        .UpdateOrderStatus(status, userId, orderId)
        .then((res) => {
          res.subscribe((r) => {
            const res = r as { status: number; message: string };
          });
        })
        .catch((err) => {
          console.log(err, 'err');
        });
    }
  }
}
