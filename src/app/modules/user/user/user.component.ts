import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateDineIntable } from '@proxy/dtos/dine-in-table-contract';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  users: CreateDineIntable[] = [];
  userTypeLabel: string = '';

  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns: Array<{ field: string; header: string }> = [];

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
      callback: (row: any) => this.openBranchDetailsAndNavigate(row),
    }
  ];

  headers: string[] = ['Name', 'Category', 'PreviousPrice', 'CurrentPrice', 'Status'];
  tableData: { Name: string; Category: string; PreviousPrice: number; CurrentPrice: number, Status: boolean }[] = [];

  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Phone', name: 'phone', type: 'tel' },
    {
      label: 'Role', name: 'role', type: 'select',
      options: [
        { label: 'POS Operator', value: 'POS' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Branch Manager', value: 'Branch_Manager' }
      ]
    },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
  ];

  filters = {
    name: '',
    email: '',
    phone: '',
    role: '',
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    // private dineIntableService: DineIntableService,
    // private exportService: ExportService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    // this.loadDiningTables();

    this.activatedRoute.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;

      switch (path) {
        case 'administrators':
          this.userTypeLabel = 'Administrators';
          break;
        case 'delivery-boys':
          this.userTypeLabel = 'Delivery Boys';
          break;
        case 'customers':
          this.userTypeLabel = 'Customers';
          break;
        case 'employees':
          this.userTypeLabel = 'Employees';
          break;
        default:
          this.userTypeLabel = 'User';
      }
    })

    this.initializeColumns();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'status', header: 'Status' },
    ];

    // Add the role column only if userTypeLabel is "Employee"
    if (this.userTypeLabel === 'Employees') {
      this.columns.splice(3, 0, { field: 'role', header: 'Role' }); // Add 'role' column at the correct position
    }
  }

  // Load all tables
  loadDiningTables(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    // this.dineIntableService.getList(defaultInput).subscribe({
    //   next: (response) => {
    //     console.log(response)
    //     this.tables = response.data.tables;
    //   },
    //   error: (err) => {
    //     console.error('Error loading tables:', err);
    //   },
    // });
  }

  handleMenuAction(action: string) {
    if (action === 'exportXLS') {
      this.exportXLS();
    } else if (action === 'print') {
      this.print();
    }
  }

  openAddEditModal(table?: CreateDineIntable, userTypeLabel?: string): void {
    const modalRef = this.modalService.open(AddUserComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.table = table || null;
    modalRef.componentInstance.userTypeLabel = userTypeLabel || this.userTypeLabel;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadDiningTables();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  exportXLS() {
    // this.exportService.exportTableToXls(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  print() {
    // this.exportService.exportTableToPdf(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDiningTables();
  }

  openBranchDetailsAndNavigate(table: CreateDineIntable) {
    this.router.navigate(['/user', table.id]);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadDiningTables();
  }

  clearFilters(): void {
    this.filters = {
      name: '', email: '', phone: '', role: '', status: ''
    };
    this.loadDiningTables();
  }
}
