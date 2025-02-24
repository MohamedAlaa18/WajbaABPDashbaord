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
  isSubmitting: boolean = false;

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

  submitForm(): void {
    // Retrieve and parse the selectedBranch from localStorage
    const selectedBranchString = localStorage.getItem('selectedBranch');
    let selectedBranch = null;

    if (selectedBranchString) {
      try {
        selectedBranch = JSON.parse(selectedBranchString); // Parse the string into an object
      } catch (error) {
        console.error('Error parsing selectedBranch:', error);
      }
    }

    if (!selectedBranch || !selectedBranch.id) {
      console.error('Selected branch is not available or invalid.');
      return; // Exit early if no valid branch is found
    }

    if (this.diningTableForm.invalid) {
      this.diningTableForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.diningTableForm.value };

    // Construct the data object with the branchId included
    const data: CreateDineIntable | UpdateDinInTable = {
      ...formValue,
      branchId: selectedBranch.id, // Include the branchId
    };

    console.log(data);
    this.isSubmitting = true; // Prevent multiple submissions

    const request$ = this.table
      ? this.dineIntableService.update(data as UpdateDinInTable)
      : this.dineIntableService.create(data as CreateDineIntable);

    request$.subscribe({
      next: (response) => {
        console.log(`Table ${this.table ? 'updated' : 'created'} successfully:`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.table ? 'updating' : 'creating'} table:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
