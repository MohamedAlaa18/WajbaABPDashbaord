import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BranchService, WajbaUserService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { NgSelectModule } from '@ng-select/ng-select';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CreateUserDto, UpdateWajbaUserDto } from '@proxy/dtos/wajba-users-contract';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() user: UpdateWajbaUserDto | null = null;
  @Input() userTypeLabel: string | null = null;
  @Input() branchList: UpdateBranchDto[] = [];
  @Output() close = new EventEmitter<void>();

  roles = [
    { id: 1, name: 'POS Operator' },
    { id: 2, name: 'Staff' },
    { id: 3, name: 'Branch Manager' },
  ];

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private wajbaUserService: WajbaUserService,
    private afterActionService: AfterActionService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: [1, Validators.required],
      customerRoleList: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      branchList: this.fb.control([]),
      type: [null],
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    console.log(this.user);
    this.loadBranches();

    this.userForm.patchValue({
      type: this.userTypeLabel === 'Administrators' ? 1 : this.userTypeLabel === 'Delivery Boys' ? 3 : this.userTypeLabel === 'Employees' ? 2 : this.userTypeLabel === 'Customers' ? 4 : null
    });

    console.log(this.userTypeLabel);
    if (this.user) {
      this.populateForm(this.user);
    }

    // Set initial validators based on userTypeLabel
    this.updateValidators();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If userTypeLabel changes, update the validators
    if (changes['userTypeLabel']) {
      this.updateValidators();
    }
  }

  updateValidators(): void {
    const roleControl = this.userForm.get('customerRoleList');
    const branchIdsControl = this.userForm.get('branchList');

    if (this.userTypeLabel === 'Employees') {
      // Make role required
      roleControl?.setValidators(Validators.required);
    } else {
      // Make role not required
      roleControl?.clearValidators();
    }

    if (this.userTypeLabel === 'Customers') {
      // Make role not required
      branchIdsControl?.clearValidators();
    } else {
      // Make role required
      branchIdsControl?.setValidators(Validators.required);
    }

    // Update the validity of the controls
    roleControl?.updateValueAndValidity();
    branchIdsControl?.updateValueAndValidity();
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
        this.branchList = branches.data.items;
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  populateForm(user: UpdateWajbaUserDto) {
    this.userForm.patchValue({
      id: user.id,
      fullName: user.fullName,
      status: user.status,
      type: user.type,
      email: user.email,
      phone: user.phone,
      customerRoleList: user.customerRoleList, // Uncomment this if user has roles
      branchList: user.branchList || []    // Ensure branchList is handled
    });
  }


  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.userForm.valid) {
      let formValue: UpdateWajbaUserDto | CreateUserDto;

      // Ensure customerRoleList is an array of integers (nullable)
      if (this.userForm.value.customerRoleList && !Array.isArray(this.userForm.value.customerRoleList)) {
        this.userForm.value.customerRoleList = [this.userForm.value.customerRoleList];
      }

      // Set up the form value based on whether it's an update or create operation
      if (this.userForm.value.id) {
        formValue = this.userForm.value as UpdateWajbaUserDto;
      } else {
        formValue = this.userForm.value as CreateUserDto;
      }

      console.log('Form value:', formValue); // Debugging: Check the form value

      if (this.user) {
        // Update existing user
        this.wajbaUserService.updateWajbaUserByInput(formValue as UpdateWajbaUserDto)
          .subscribe(
            response => {
              console.log('User updated successfully:', response); // Debugging: Check success response
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating user:', error); // Debugging: Check error response
            }
          );
      } else {
        // Create a new user
        this.wajbaUserService.registerByInput(formValue as CreateUserDto)
          .subscribe(
            response => {
              console.log('User created successfully:', response); // Debugging: Check success response
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error creating user:', error); // Debugging: Check error response
            }
          );
      }
    } else {
      console.log('Form is invalid'); // Debugging: Check if the form is invalid
      // Mark all form controls as touched to trigger validation messages
      this.userForm.markAllAsTouched();
    }
  }
}
