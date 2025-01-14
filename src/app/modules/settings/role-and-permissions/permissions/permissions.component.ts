import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsSidebarComponent } from "../../settings-sidebar/settings-sidebar.component";

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [FormsModule, CommonModule, SettingsSidebarComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent {
  permissions!: any[];

  constructor(
    // private permissionService: PermissionService,
  ) { }

  ngOnInit(): void {
    // this.permissionService.getPermissions(this.selectedRole.id).subscribe((response: any) => {
    //   this.permissions = response.data;
    //   console.log(response);
    // }, (error) => {
    //   console.error('Failed to load permissions:', error);
    // });
  }

  submit(): void {
    // Call the service to assign permissions to the selected role
    // this.permissionService.assignPermissions(this.selectedRole.id, this.permissions).subscribe(
    //   (response) => {
    //     console.log('Permissions assigned successfully', response);
    //     // You can add a success message or any other logic here
    //   },
    //   (error) => {
    //     console.error('Failed to assign permissions', error);
    //     // You can add error handling logic here
    //   }
    // );
  }
}
