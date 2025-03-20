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

  activeOrders = [
    {
      orderNumber: 124,
      orderType: 'Dine In',
      items: [
        { name: 'Pizza Chicken BBQ (Medium)', notes: 'Without green olive', completed: false },
        { name: 'Buffalo Burger (Single)', notes: 'Extra Bacon', completed: false }
      ]
    },
    {
      orderNumber: 125,
      orderType: 'Delivery',
      items: [
        { name: 'Pizza Chicken BBQ (Medium)', notes: 'Without green olive', completed: false },
        { name: 'Buffalo Burger (Single)', notes: 'Extra Bacon', completed: false }
      ]
    },
    {
      orderNumber: 127,
      orderType: 'Drive Thru',
      items: [
        { name: 'Pizza Chicken BBQ (Medium)', notes: 'Without green olive', completed: false },
        { name: 'Buffalo Burger (Single)', notes: 'Extra Bacon', completed: false }
      ]
    }
  ];

  finishedOrders = [
    {
      orderNumber: 126,
      orderType: 'Takeaway',
      items: [
        { name: 'Pasta Alfredo', notes: 'Extra cheese', completed: true },
        { name: 'Caesar Salad', notes: 'No dressing', completed: true }
      ]
    }
  ];


  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // this.loadKitchenOrders();
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
