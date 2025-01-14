import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';


@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.scss'
})
export class AddRoleComponent {
  @Input() isOpen: boolean = false;
  // @Input() role: role | null = null;
  @Output() close = new EventEmitter<void>();

  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    // private roleService: RoleService,
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // if (this.role) {
    //   this.populateForm(this.role);
    // }
  }

  // populateForm(role: IRole) {
  //   this.roleForm.patchValue({
  //     name: role.name,
  //   });
  // }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.roleForm.valid) {
      const formData = this.roleForm.value;
      const { name } = formData;

      // if (this.role) {
      //   // Editing an existing role
      //   this.roleService.updateRole(this.role.id, name)
      //     .subscribe(response => {
      //       console.log('Attribute edited:', response);
      //       this.closeModal();
      //       this.afterActionService.reloadCurrentRoute();
      //     }, error => {
      //       console.error('Error editing attribute:', error);
      //     });
      // } else {
      //   // Adding a new role
      //   this.roleService.createRole(name)
      //     .subscribe(response => {
      //       console.log('Attribute added:', response);
      //       this.closeModal();
      //       this.afterActionService.reloadCurrentRoute();
      //     }, error => {
      //       console.error('Error adding attribute:', error);
      //     });
      // }
    }
  }
}
