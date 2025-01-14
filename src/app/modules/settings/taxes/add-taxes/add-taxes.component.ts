import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemTaxService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { UpdateItemTaxDto } from '@proxy/dtos/item-tax-contract';

@Component({
  selector: 'app-add-taxes',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-taxes.component.html',
  styleUrl: './add-taxes.component.scss'
})
export class AddTaxesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() tax: UpdateItemTaxDto | null = null;
  @Output() close = new EventEmitter<void>();

  taxForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private itemTaxService: ItemTaxService,
  ) {
    this.taxForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      taxRate: ['', [Validators.required, Validators.min(0)]],
      status: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.tax) {
      this.populateForm(this.tax);
    }
  }

  populateForm(tax: UpdateItemTaxDto) {
    this.taxForm.patchValue({
      name: tax.name,
      code: tax.code,
      taxRate: tax.taxRate,
      status: tax.status ? 1 : 0,
    });
  }

  // Method to close the modal
  closeModal() {
    this.close.emit();
  }

  // Handle form submission (add or edit currency)
  submitForm() {
    if (this.taxForm.valid) {
      const formValue = this.taxForm.value;

      console.log('Form values:', formValue);

      if (this.tax) {
        // Ensure formValue has the 'id' property for update
        const updatePayload: UpdateItemTaxDto = {
          ...formValue,
          id: this.tax.id // Assign the `id` from the current currency
        };

        this.itemTaxService.update(updatePayload)
          .subscribe(
            response => {
              console.log('Currency updated:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating currency:', error);
            }
          );
      } else {
        // Create new currency
        const createPayload: UpdateItemTaxDto = {
          ...formValue
        };

        this.itemTaxService.create(createPayload)
          .subscribe(
            response => {
              console.log('Currency added:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error adding currency:', error);
            }
          );
      }
    } else {
      this.taxForm.markAllAsTouched();
    }
  }
}
