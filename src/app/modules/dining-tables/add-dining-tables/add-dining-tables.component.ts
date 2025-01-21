import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DineIntableService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { CreateDineIntable, UpdateDinInTable } from '@proxy/dtos/dine-in-table-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

@Component({
  selector: 'app-add-dining-tables',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-dining-tables.component.html',
  styleUrl: './add-dining-tables.component.scss'
})
export class AddDiningTablesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() table: UpdateDinInTable | null = null;
  @Output() close = new EventEmitter<void>();

  diningTableForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dineIntableService: DineIntableService,
    private afterActionService: AfterActionService,
  ) {
    this.diningTableForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      size: ['', Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit(): void {
console.log('Table:', this.table);
    if (this.table) {
      this.populateForm(this.table);
    }
  }

  populateForm(item: UpdateDinInTable) {
    this.diningTableForm.patchValue({
      id: item.id,
      name: item.name,
      status: item.status,
      size: item.size,
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.diningTableForm.valid) {
      // Declare the formValue outside the if-else block
      const formValue = this.diningTableForm.value;

      const data: CreateDineIntable | UpdateDinInTable = {
        ...formValue,
        branchId: 2, // Include the full Base64ImageModel
      };

      console.log(data);

      if (this.table) {
        // Update existing Table
        this.dineIntableService.update(data as UpdateDinInTable)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Table updated successfully:', response);
              this.afterActionService.reloadCurrentRoute();
              this.closeModal();
            },
            error => {
              // Handle error response
              console.error('Error updating Table:', error);
            }
          );
      } else {
        // Create a new Table
        this.dineIntableService.create(data as CreateDineIntable)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Table created successfully:', response);
              this.afterActionService.reloadCurrentRoute();
              this.closeModal();
            },
            error => {
              // Handle error response
              console.error('Error creating Table:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.diningTableForm.markAllAsTouched();
    }
  }
}
