import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemAttributeService } from '@proxy/controllers';
import { CreateUpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-item-attributes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-item-attributes.component.html',
  styleUrl: './add-item-attributes.component.scss'
})
export class AddItemAttributesComponent {
  @Input() isOpen: boolean = false;
  @Input() itemAttribute: CreateUpdateItemAttributeDto | null = null;
  @Output() close = new EventEmitter<void>();

  itemAttributeForm: FormGroup;
  isMapModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemAttributeService: ItemAttributeService,
  ) {
    this.itemAttributeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      status: ['active'],
    });
  }

  ngOnInit(): void {
    if (this.itemAttribute) {
      this.populateForm(this.itemAttribute);
    }
  }

  populateForm(itemAttribute: CreateUpdateItemAttributeDto) {
    this.itemAttributeForm.patchValue({
      // id: itemAttribute.id,
      // name: itemAttribute.name,
      // email: itemAttribute.email,
      // city: itemAttribute.city,
      // state: itemAttribute.state,
      // phone: itemAttribute.phone,
      // zipCode: itemAttribute.zipCode,
      // address: itemAttribute.address,
      // status: itemAttribute.status === 1 ? 'active' : 'inactive',
      // longitude: itemAttribute.longitude || '',
      // latitude: itemAttribute.latitude || '',
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.itemAttributeForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: CreateUpdateItemAttributeDto | CreateUpdateItemAttributeDto;

      // Determine whether it's an update or create operation
      if (this.itemAttributeForm.value.id) {
        formValue = this.itemAttributeForm.value as CreateUpdateItemAttributeDto;
      } else {
        formValue = this.itemAttributeForm.value as CreateUpdateItemAttributeDto;
      }

      console.log(formValue);

      if (this.itemAttribute) {
        // Update existing itemAttribute
        // this.itemAttributeService.update(formValue as CreateUpdateItemAttributeDto)
        //   .subscribe(
        //     response => {
        //       // Handle successful response
        //       console.log('itemAttribute updated successfully:', response);
        //     },
        //     error => {
        //       // Handle error response
        //       console.error('Error updating itemAttribute:', error);
        //     }
        //   );
      } else {
        // Create a new itemAttribute
        this.itemAttributeService.create(formValue as CreateUpdateItemAttributeDto)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Item attribute created successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error creating Item attribute:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.itemAttributeForm.markAllAsTouched();
    }
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }
}
