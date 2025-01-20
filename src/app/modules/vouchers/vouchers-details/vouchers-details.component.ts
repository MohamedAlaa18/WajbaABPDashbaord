import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OfferService } from '@proxy/controllers';
import { UpdateOfferdto } from '@proxy/dtos/offers-contract';

@Component({
  selector: 'app-vouchers-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vouchers-details.component.html',
  styleUrl: './vouchers-details.component.scss'
})
export class VouchersDetailsComponent implements OnInit {
  voucherId!: number;
  voucher!: UpdateOfferdto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private vouchersService: OfferService,
  ) {
    this.voucherId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getVoucherDetails();
  }

  // Method to get offer details
  getVoucherDetails() {
    if (this.voucherId) {
      this.vouchersService.getById(this.voucherId).subscribe(
        (response) => {
          // this.voucher = response.data;
          console.log('voucher details:', this.voucher);
        },
        (error) => {
          console.error('Error fetching voucher details:', error);
        }
      );
    }
  }
}
