import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BranchService, DineIntableService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { CreateDineIntable } from '@proxy/dtos/dine-in-table-contract';
import { GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() table: CreateDineIntable | null = null;
  @Input() userTypeLabel: string | null = null;
  @Input() branchesList: UpdateBranchDto[] = [];
  @Output() close = new EventEmitter<void>();

  roles: any;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dineIntableService: DineIntableService,
    private branchService: BranchService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: [1, Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      branches: this.fb.array([], Validators.required), // Initialize the FormArray
    }, { validators: this.passwordsMatch });
  }

  get branches(): FormArray {
    return this.userForm.get('branches') as FormArray;
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  loadBranches(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.branchService.getList(defaultInput).subscribe({
      next: (branches) => {
        this.branchesList = branches.data.items;
        this.branches.clear(); // Clear any existing controls
        this.branchesList.forEach(branch => {
          this.branches.push(this.fb.control(branch.id)); // Push branch IDs as FormControl
        });
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  populateForm(item: CreateDineIntable) {
    this.userForm.patchValue({
      id: item.id,
      name: item.name,
      status: item.isActive,
      size: item.size,
    });
  }

  onBranchSelectionChange(selectedBranches: number[]): void {
    this.branches.clear(); // Clear previous selections
    selectedBranches.forEach(branchId => {
      this.branches.push(this.fb.control(branchId)); // Add new selections
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.userForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: CreateDineIntable | CreateDineIntable;

      // Determine whether it's an update or create operation
      if (this.userForm.value.id) {
        formValue = this.userForm.value as CreateDineIntable;
      } else {
        formValue = this.userForm.value as CreateDineIntable;
      }

      console.log(formValue);

      if (this.table) {
        // Update existing branch
        // this.dineIntableService.update(formValue as CreateDineIntable)
        //   .subscribe(
        //     response => {
        //       // Handle successful response
        //       console.log('Branch updated successfully:', response);
        //     },
        //     error => {
        //       // Handle error response
        //       console.error('Error updating branch:', error);
        //     }
        //   );
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
      this.userForm.markAllAsTouched();
    }
  }
}
