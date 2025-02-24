import { Component, OnInit } from '@angular/core';
import { KitchenCardComponent } from '../kitchen-card/kitchen-card.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '@proxy/controllers';
import { CreateOrderDto } from '@proxy/dtos/order-contract';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, KitchenCardComponent],
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
  orders: CreateOrderDto[] = [];
  currentOrders = 'active';
  currentDate = new Date(); // To display the current date/time

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadKitchenOrders();
  }

  loadKitchenOrders(): void {
    // Modify the API call to match the signature of your endpoint
    // this.orderService.getAllOrdersForCustomerByBranchIdAndPageSizeAndPageNumber(1).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.orders = response.data.items; // Assuming orders are in 'items'
    //   },
    //   error: (err) => {
    //     console.error('Error loading orders:', err);
    //   },
    // });
  }

  // get activeOrders() {
  //   // Filter active orders based on a status or another condition
  //   return this.orders.filter(order => order.status === 1);
  // }

  // get finishedOrders() {
  //   // Filter finished orders based on a status or another condition
  //   return this.orders.filter(order => order.status === 0);
  // }
}
