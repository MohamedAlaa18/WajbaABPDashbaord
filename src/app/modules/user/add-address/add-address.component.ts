import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../shared/icons/icons.component";

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss'
})
export class AddAddressComponent {
  @Input() isOpen: boolean = false;
  @Input() employeeId!: any;
  // @Input() address: Address | null = null;
  @Output() close = new EventEmitter<void>();

  selectedForm: 'apartment' | 'house' | 'office' = 'apartment';
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private employeeService: EmployeeService,
    // private customerService: CustomerService,
    private afterActionService: AfterActionService,
  ) {
    this.addressForm = this.fb.group({
      buildingName: ['', Validators.required],
      apartmentNumber: [''],
      floor: [''],
      street: ['', Validators.required],
      addressLabel: ['']
    });

    this.updateFormValidators();
  }

  ngOnInit(): void {
    // if (this.address) {
    //   this.populateForm(this.address);
    // }
  }

  // populateForm(address: Address) {
  //   console.log(address)
  //   this.addressForm.patchValue({
  //     buildingName: address.buildingName,
  //     apartmentNumber: address.apartmentNumber,
  //     floor: address.floor,
  //     street: address.street,
  //     addressLabel: address.addressLabel,
  //   });
  // }

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

  submitForm() {
    if (this.addressForm.valid) {
      const addressData = {
        ...this.addressForm.value,
        addressType: this.getAddressType()
      };
      console.log(addressData)
      // if (!this.address) {
      //   // Add address if in "add" mode
      //   this.employeeService.addEmployeeAddress(this.employeeId, addressData).subscribe(
      //     (response) => {
      //       console.log('Address added successfully:', response);
      //       this.afterActionService.reloadCurrentRoute();
      //       this.closeModal();
      //     },
      //     (error) => {
      //       console.error('Error adding address:', error);
      //     }
      //   );
      // } else {
      //   // Update address if in "edit" mode
      //   this.employeeService.updateEmployeeAddress(this.employeeId, this.address.id, addressData).subscribe(
      //     (response) => {
      //       console.log('Address updated successfully:', response);
      //       this.afterActionService.reloadCurrentRoute();
      //       this.closeModal();
      //     },
      //     (error) => {
      //       console.error('Error updating address:', error);
      //     }
      //   );
      // }
    } else {
      console.error('Form is invalid');
    }
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
