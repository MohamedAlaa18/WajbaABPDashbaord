import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PosOrderService } from '@proxy/fos-api/controllers';
import { OrderDTO } from '@proxy/dtos/order-contract';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss']
})
export class OrdersDetailsComponent implements OnInit {
  order: OrderDTO;
  orderId: number;
  isModalOpen: boolean = false;
  paidMenuOptions = ['Paid', 'Unpaid'];
  pendingMenuOptions = ['Pending', 'Accepting', 'Processing', 'Out for Delivery', 'Delivered', 'Returned'];

  // Variables to store selected values
  selectedPaidOption: string = 'Paid';
  selectedPendingOption: string = 'Pending';

  constructor(
    private posOrderService: PosOrderService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadOffer();
  }

  // Method to get offer details
  loadOffer() {
    if (this.orderId) {
      this.posOrderService.getOrderByIdById(this.orderId).subscribe(
        (response) => {
          console.log(response);
          this.order = response.data;
        },
        (error) => {
          console.error('Error fetching offer details:', error);
        }
      );
    }
  }

  onMenuSelect(type: 'paid' | 'pending', option: string): void {
    if (type === 'paid') {
      this.selectedPaidOption = option;
    } else if (type === 'pending') {
      this.selectedPendingOption = option;
    }
    console.log(`Selected ${option} from ${type} menu.`);
  }
}
