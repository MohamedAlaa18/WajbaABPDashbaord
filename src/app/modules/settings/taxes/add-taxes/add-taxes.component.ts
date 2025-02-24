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
  isSubmitting: boolean = false; // Prevent multiple submissions

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
    if (this.taxForm.invalid) {
      this.taxForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Prevent multiple submissions
    const formValue = { ...this.taxForm.value };

    console.log('Form values:', formValue);

    const request$ = this.tax
      ? this.itemTaxService.update({ ...formValue, id: this.tax.id } as UpdateItemTaxDto)
      : this.itemTaxService.create(formValue as UpdateItemTaxDto);

    request$.subscribe({
      next: (response) => {
        console.log(`Tax ${this.tax ? 'updated' : 'created'} successfully:`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.tax ? 'updating' : 'creating'} tax:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
