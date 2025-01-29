import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CouponService } from '@proxy/controllers';
import { CreateUpdateCouponDto, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';


@Component({
  selector: 'app-add-push-notification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-push-notification.component.html',
  styleUrl: './add-push-notification.component.scss'
})
export class AddPushNotificationComponent {
  @Input() isOpen: boolean = false;
  @Input() voucher: UpdateCoupondto | null = null;
  @Output() close = new EventEmitter<void>();

  users: WajbaUserDto[] = [];
  roles: any[] = [];
  pushNotificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private afterActionService: AfterActionService,
    private base64Service: Base64Service,
  ) {
    this.pushNotificationForm = this.fb.group({
      id: [this.voucher?.id],
      role: ['', Validators.required],
      user: ['', Validators.required],
      title: ['', Validators.required],
      date: ['',],
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
    this.pushNotificationForm.patchValue({
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
        this.pushNotificationForm.patchValue({
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
    if (this.pushNotificationForm.valid) {
      let formValue: CreateUpdateCouponDto | UpdateCoupondto;

      // Determine whether it's an update or create operation
      if (this.pushNotificationForm.value.id) {
        formValue = this.pushNotificationForm.value as UpdateCoupondto;
      } else {
        formValue = this.pushNotificationForm.value as CreateUpdateCouponDto;
      }

      if (this.voucher) {
        // Update existing voucher
        this.couponService.update(formValue as UpdateCoupondto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      } else {
        // Create a new voucher
        this.couponService.create(formValue as CreateUpdateCouponDto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.pushNotificationForm.markAllAsTouched();
    }
  }
}
