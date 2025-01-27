import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CouponService } from '@proxy/controllers';
import { UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { DatePipe } from '@angular/common';  // Import DatePipe

@Component({
  selector: 'app-vouchers-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vouchers-details.component.html',
  styleUrls: ['./vouchers-details.component.scss'],
  providers: [DatePipe]  // Provide DatePipe
})
export class VouchersDetailsComponent implements OnInit {
  voucherId!: number;
  voucher!: UpdateCoupondto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private couponService: CouponService,
    private datePipe: DatePipe  // Inject DatePipe
  ) {
    this.voucherId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getVoucherDetails();
  }

  // Method to get voucher details
  getVoucherDetails() {
    if (this.voucherId) {
      this.couponService.getById(this.voucherId).subscribe(
        (response) => {
          this.voucher = response.data;
          console.log('voucher details:', this.voucher);
        },
        (error) => {
          console.error('Error fetching voucher details:', error);
        }
      );
    }
  }

  // Format date to a readable format
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'mediumDate');  // 'mediumDate' gives a readable format
  }
}
