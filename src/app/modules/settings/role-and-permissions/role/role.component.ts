import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRoleComponent } from '../add-role/add-role.component';
import { SettingsSidebarComponent } from "../../settings-sidebar/settings-sidebar.component";
import { UpdateItemTaxDto } from '@proxy/dtos/item-tax-contract';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, RouterModule, IconsComponent, SettingsSidebarComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  roles: UpdateItemTaxDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private afterActionService: AfterActionService,
    private modalService: NgbModal,
    // private roleService: roleServic,
  ) { }

  ngOnInit(): void {
    this.loadRoles();

  }

  loadRoles() {
    // this.roleService.getAllRoles().subscribe((response: any) => {
    //   if (response) {
    //     this.roles = response.data;
    //     console.log(response)
    //   } else {
    //     console.error('The response is not an array:', response);
    //     this.roles = [];
    //   }
    // }, (error) => {
    //   console.error('Failed to load roles:', error);
    // });
  }

  openAddEditModal(role?: any): void {
    const modalRef = this.modalService.open(AddRoleComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.role = role || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadRoles();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openItemDetails(category: UpdateItemTaxDto) {
    localStorage.setItem('selectedRole', JSON.stringify(category));
    localStorage.setItem('selectedComponentName', 'Role & Permissions Details');
    this.afterActionService.reloadCurrentRoute();
  }
}
