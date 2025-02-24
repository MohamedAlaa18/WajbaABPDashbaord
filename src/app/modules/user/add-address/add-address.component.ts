import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { UserAddressService } from '@proxy/controllers';
import { CreateUserAddressDto, UpdateUserAddressDto } from '@proxy/dtos/user-address-contract';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss'
})
export class AddAddressComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() customerId!: any;
  @Input() address: UpdateUserAddressDto | null = null;
  @Output() close = new EventEmitter<void>();

  selectedForm: 'apartment' | 'house' | 'office' = 'apartment';
  addressForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userAddressService: UserAddressService,
    private afterActionService: AfterActionService,
  ) {
    this.addressForm = this.fb.group({
      id: [null],
      wajbaUserId: [null],
      buildingName: ['', Validators.required],
      apartmentNumber: [''],
      floor: [''],
      street: ['', Validators.required],
      addressLabel: [''],
      addressType: [null],
      title: ['']
    });

    this.updateFormValidators();
  }

  ngOnInit(): void {
    if (this.address) {
      this.populateForm(this.address);
    } else {
      this.addressForm.patchValue({
        wajbaUserId: this.customerId,
      });
    }
  }

  populateForm(address: UpdateUserAddressDto) {
    console.log(address)
    this.addressForm.patchValue({
      id: address.id,
      wajbaUserId: this.customerId,
      buildingName: address.buildingName,
      apartmentNumber: address.apartmentNumber,
      floor: address.floor,
      street: address.street,
      addressLabel: address.addressLabel,
    });
  }

  selectForm(formType: 'apartment' | 'house' | 'office') {
    this.selectedForm = formType;
    this.updateFormValidators();
  }

  updateFormValidators() {
    if (this.selectedForm === 'house') {
      this.addressForm.get('apartmentNumber')?.clearValidators();
      this.addressForm.get('floor')?.clearValidators();
    } else {
      this.addressForm.get('apartmentNumber')?.setValidators(Validators.required);
      this.addressForm.get('floor')?.setValidators(Validators.required);
    }
    this.addressForm.get('apartmentNumber')?.updateValueAndValidity();
    this.addressForm.get('floor')?.updateValueAndValidity();
  }

  submitForm(): void {
    if (this.addressForm.invalid) {
      console.error('Form is invalid');
      this.addressForm.markAllAsTouched();
      return;
    }

    let formValue: UpdateUserAddressDto | CreateUserAddressDto = { ...this.addressForm.value };

    // Add AddressType before sending the data
    formValue.addressType = this.getAddressType();

    this.isSubmitting = true; // Prevent multiple submissions

    const request$ = this.address
      ? this.userAddressService.update(formValue as UpdateUserAddressDto)
      : this.userAddressService.create(formValue as CreateUserAddressDto);

    request$.subscribe({
      next: (response) => {
        console.log(`Address ${this.address ? 'updated' : 'added'} successfully:`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.address ? 'updating' : 'adding'} address:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  private getAddressType(): number {
    switch (this.selectedForm) {
      case 'apartment': return 0;
      case 'office': return 1;
      case 'house': return 2;
      default: return 0;
    }
  }
}
