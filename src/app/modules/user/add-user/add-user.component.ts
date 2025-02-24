import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BranchService, RoleService, WajbaUserService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { NgSelectModule } from '@ng-select/ng-select';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { AccountInfoEditByWajbaUserId, CreateUserDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { RolesDto } from '@proxy/dtos/role-contract';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() user: WajbaUserDto | null = null;
  @Input() userTypeLabel: string | null = null;
  @Input() branchList: UpdateBranchDto[] = [];
  @Output() close = new EventEmitter<void>();

  returnedErrorMessage: string | null = null;
  isSubmitting: boolean = false;

  roles: RolesDto[] = [
    { id: 1, name: 'POS Operator' },
    { id: 2, name: 'Staff' },
    { id: 3, name: 'Branch Manager' },
  ];

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private wajbaUserService: WajbaUserService,
    private roleService: RoleService,
    private afterActionService: AfterActionService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      status: [1, Validators.required],
      role: [null],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      branchList: this.fb.control([]),
      type: [null],
      genderType: [1]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    console.log(this.user);
    this.loadBranches();
    this.loadRoles();

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
    const roleControl = this.userForm.get('role');
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
      next: (response) => {
        this.branchList = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getall().subscribe({
      next: (response) => {
        this.roles = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    });
  }

  populateForm(user: WajbaUserDto) {
    this.userForm.patchValue({
      id: user.id,
      fullName: user.fullName,
      status: user.status,
      type: user.type,
      email: user.email,
      phone: user.phone,
      role: user.role, // Uncomment this if user has roles
      branchList: user.branchList || []    // Ensure branchList is handled
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.userForm.invalid) {
      console.log('Form is invalid');
      this.userForm.markAllAsTouched();
      return;
    }

    let formValue: AccountInfoEditByWajbaUserId | CreateUserDto = { ...this.userForm.value };

    console.log('Form value:', formValue); // Debugging

    this.isSubmitting = true; // Prevent multiple submissions

    const request$ = this.user
      ? this.wajbaUserService.accountInfoEditByAccountInfoEditByWajbaUserId(formValue as AccountInfoEditByWajbaUserId)
      : this.wajbaUserService.registerByInput(formValue as CreateUserDto);

    request$.subscribe({
      next: (response) => {
        console.log(`User ${this.user ? 'updated' : 'created'} successfully:`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.user ? 'updating' : 'creating'} user:`, error);
        this.returnedErrorMessage = error.error?.message || 'An error occurred';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
