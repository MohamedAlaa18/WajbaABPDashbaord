import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent {
  isModalOpen: boolean = false;
  paidMenuOptions = ['Paid', 'Unpaid'];
  pendingMenuOptions = ['Pending', 'Accepting', 'Processing', 'Out for Delivery', 'Delivered', 'Returned'];

  // Variables to store selected values
  selectedPaidOption: string = 'Paid';
  selectedPendingOption: string = 'Pending';

  onMenuSelect(type: 'paid' | 'pending', option: string): void {
    if (type === 'paid') {
      this.selectedPaidOption = option;
    } else if (type === 'pending') {
      this.selectedPendingOption = option;
    }
    console.log(`Selected ${option} from ${type} menu.`);
  }
}
