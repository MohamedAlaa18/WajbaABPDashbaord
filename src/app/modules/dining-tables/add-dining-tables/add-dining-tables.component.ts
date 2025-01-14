import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DineIntableService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { CreateDineIntable, UpdateDinInTable } from '@proxy/dtos/dine-in-table-contract';

@Component({
  selector: 'app-add-dining-tables',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-dining-tables.component.html',
  styleUrl: './add-dining-tables.component.scss'
})
export class AddDiningTablesComponent {
  @Input() isOpen: boolean = false;
  @Input() table: UpdateDinInTable | null = null;
  @Output() close = new EventEmitter<void>();

  diningTableForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dineIntableService: DineIntableService,
  ) {
    this.diningTableForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      size: ['', Validators.required],
      status: [1, Validators.required],
    });
  }

  populateForm(item: UpdateDinInTable) {
    this.diningTableForm.patchValue({
      id: item.id,
      name: item.name,
      status: item.isActive,
      size: item.size,
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.diningTableForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: UpdateDinInTable | CreateDineIntable;

      // Determine whether it's an update or create operation
      if (this.diningTableForm.value.id) {
        formValue = this.diningTableForm.value as UpdateDinInTable;
      } else {
        formValue = this.diningTableForm.value as CreateDineIntable;
      }

      console.log(formValue);

      if (this.table) {
        // Update existing branch
        this.dineIntableService.update(formValue as UpdateDinInTable)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch updated successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error updating branch:', error);
            }
          );
      } else {
        // Create a new branch
        this.dineIntableService.create(formValue as CreateDineIntable)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch created successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error creating branch:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.diningTableForm.markAllAsTouched();
    }
  }
}
