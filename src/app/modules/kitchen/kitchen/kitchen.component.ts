import { Component } from '@angular/core';
import { KitchenCardComponent } from '../kitchen-card/kitchen-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, KitchenCardComponent],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.scss'
})
export class KitchenComponent {
  currentOrders = 'active';
  currentDate = new Date(); // To display the current date/time

  ActiveOrders = [
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
    }
  ];

  FinishedOrders = [
    {
      orderNumber: 126,
      orderType: 'Takeaway',
      items: [
        { name: 'Pasta Alfredo', notes: 'Extra cheese', completed: true },
        { name: 'Caesar Salad', notes: 'No dressing', completed: true }
      ]
    }
  ];
}
