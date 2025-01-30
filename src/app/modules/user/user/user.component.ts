import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { AddUserComponent } from '../add-user/add-user.component';
import { WajbaUserService } from '@proxy/controllers';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: WajbaUserDto[] = [];
  userTypeLabel: string = '';
  currentPage: number = 1;
  totalPages: number = 4;

  isFilterVisible: boolean = false;

  columns: Array<{ field: string; header: string }> = [];
  tableData: any[] = []; // This will be dynamically generated

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => this.openAddEditModal(row),
    },
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openUserDetailsAndNavigate(row),
    }
  ];

  filterFields = [];

  filters = {
    name: '',
    email: '',
    phone: '',
    role: '',
    type: null,
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    private wajbaUserService: WajbaUserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      switch (path) {
        case 'administrators':
          this.userTypeLabel = 'Administrators';
          this.filters.type = 1; // Admin
          break;
        case 'delivery-boys':
          this.userTypeLabel = 'Delivery Boys';
          this.filters.type = 3; // Deliveryboy
          break;
        case 'customers':
          this.userTypeLabel = 'Customers';
          this.filters.type = 4; // Customer
          break;
        case 'employees':
          this.userTypeLabel = 'Employees';
          this.filters.type = 2; // Employee
          break;
        default:
          this.userTypeLabel = 'User';
          this.filters.type = undefined; // No specific type filter
      }
      this.initializeColumns(); // Initialize columns based on user type
      this.initializeFilterFields(); // Initialize filters based on user type
      this.loadUsers(); // Load users after setting the user type
    });
  }

  initializeFilterFields(): void {
    this.filterFields = [
      { label: 'Name', name: 'name', type: 'text' },
      { label: 'Email', name: 'email', type: 'email' },
      { label: 'Phone', name: 'phone', type: 'tel' },
      {
        label: 'Status', name: 'status', type: 'select',
        options: [
          { label: 'Active', value: 1 },
          { label: 'Inactive', value: 2 }
        ]
      },
    ];

    // Add the "Role" filter field only if filters.type === 2 (Employees)
    if (this.filters.type === 2) {
      this.filterFields.splice(3, 0, {
        label: 'Role', name: 'role', type: 'select',
        options: [
          { label: 'POS Operator', value: 1 },
          { label: 'Staff', value: 2 },
          { label: 'Branch Manager', value: 3 },
        ]
      });
    }
  }

  loadUsers(): void {
    const defaultInput: GetUserListDto = {
      fullName: this.filters.name,
      type: this.filters.type, // Set the filtered type dynamically
      email: this.filters.email,
      phone: this.filters.phone,
      role: this.filters.role ? Number(this.filters.role) : undefined, // Convert role to number
      status: this.filters.status ? Number(this.filters.status) : undefined,
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
    };

    this.wajbaUserService.getWajbaUserByInput(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.users = response.items;
        this.totalPages = Math.ceil(response.totalCount / 10); // Update total pages

        // Dynamically generate tableData based on columns and users
        this.tableData = this.users.map((user) => {
          const row: any = {};
          this.columns.forEach((column) => {
            row[column.field] = user[column.field as keyof WajbaUserDto];
          });
          return row;
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'fullName', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'status', header: 'Status' },
    ];

    // Add the role column only if userTypeLabel is "Employees"
    if (this.userTypeLabel === 'Employees') {
      this.columns.splice(3, 0, { field: 'role', header: 'Role' }); // Add 'role' column at the correct position
    }
  }

  openAddEditModal(user?: WajbaUserDto, userTypeLabel?: string): void {
    const modalRef = this.modalService.open(AddUserComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.user = user || null;
    modalRef.componentInstance.userTypeLabel = userTypeLabel || this.userTypeLabel;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadUsers(); // Reload users after saving
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers(); // Reload users for the new page
  }

  openUserDetailsAndNavigate(user: WajbaUserDto) {
    this.router.navigate(['/user', user.id]); // Navigate to user details
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible; // Toggle filter visibility
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadUsers(); // Reload users with new filters
  }

  clearFilters(): void {
    this.filters = {
      name: '', email: '', phone: '', role: '', type: null, status: ''
    };
    this.loadUsers(); // Reload users without filters
  }
}
