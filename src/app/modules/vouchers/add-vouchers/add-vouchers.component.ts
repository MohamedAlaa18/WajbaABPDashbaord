import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CouponService } from '@proxy/controllers';
import { CreateUpdateCouponDto, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-vouchers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-vouchers.component.html',
  styleUrl: './add-vouchers.component.scss'
})
export class AddVouchersComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() voucher: UpdateCoupondto | null = null;
  @Output() close = new EventEmitter<void>();

  voucherForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private afterActionService: AfterActionService,
    private base64Service: Base64Service,
  ) {
    this.voucherForm = this.fb.group({
      id: [this.voucher?.id],
      name: ['', Validators.required],
      code: ['', Validators.required],
      discount: ['', Validators.required],
      limitPerUser: ['', Validators.required],
      discountType: ['', Validators.required],
      startDate: ['',],
      endDate: ['',],
      minDiscount: ['',],
      maxDiscount: ['', Validators.required],
      description: [''],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    if (this.voucher) {
      this.populateForm(this.voucher);
    }
  }

  populateForm(voucher: UpdateCoupondto) {
    this.voucherForm.patchValue({
      id: voucher.id,
      name: voucher.name,
      code: voucher.code,
      discount: voucher.discount,
      limitPerUser: voucher.limitPerUser,
      discountType: voucher.discountType,
      startDate: this.formatDateForInput(voucher.startDate), // Format the date
      endDate: this.formatDateForInput(voucher.endDate), // Format the date
      maxDiscount: voucher.maximumDiscount,
      minDiscount: voucher.minimumOrderAmount,
      description: voucher.description,
    });
  }

  formatDateForInput(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    // Use `formatDate` to format the date to 'yyyy-MM-dd'
    return formatDate(dateString, 'yyyy-MM-dd', 'en-US');
  }

  closeModal() {
    this.close.emit();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Use Base64Service to convert the file to a Base64 string
      this.base64Service.convertToBase64(file).then(base64Content => {
        this.voucherForm.patchValue({
          image: {
            fileName: file.name,
            base64Content: base64Content,
          },
        });
      }).catch(error => {
        console.error("Error converting file to Base64:", error);
      });
    }
  }

  submitForm(): void {
    if (this.voucherForm.invalid) {
      this.voucherForm.markAllAsTouched();
      return;
    }

    const formValues = { ...this.voucherForm.value };

    this.isSubmitting = true; // Prevent multiple submissions

    const request$ = this.voucher
      ? this.couponService.update({ ...formValues, id: this.voucher.id } as UpdateCoupondto)
      : this.couponService.create(formValues as CreateUpdateCouponDto);

    request$.subscribe({
      next: (response) => {
        console.log(`Voucher ${this.voucher ? 'updated' : 'added'} successfully:`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.voucher ? 'updating' : 'adding'} voucher:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
