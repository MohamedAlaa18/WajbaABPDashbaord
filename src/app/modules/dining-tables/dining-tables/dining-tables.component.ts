import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DineIntableService } from '@proxy/controllers';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { AddDiningTablesComponent } from '../add-dining-tables/add-dining-tables.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { GetDiniTableInput, UpdateDinInTable } from '@proxy/dtos/dine-in-table-contract';

@Component({
  selector: 'app-dining-tables',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './dining-tables.component.html',
  styleUrl: './dining-tables.component.scss'
})
export class DiningTablesComponent implements OnInit {
  tables: UpdateDinInTable[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'size', header: 'size' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { name: string; size: number; status: string }[] = [];

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => this.openAddEditModal(row),
    },
    {
      icon: 'assets/images/qr-code.svg',
      tooltip: 'QR',
      show: (row: any) => true,
      callback: (row: any) => this.downloadQRCode(row),
    },
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openDiningTableDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    }
  ];

  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Size', name: 'size', type: 'text' },
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
    size: '',
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    private dineIntableService: DineIntableService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadDiningTables();
  }

  // Load all tables
  loadDiningTables(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
    };

    // Convert filters to match the expected types
    const inputWithFilters = {
      ...defaultInput,
      name: this.filters.name || undefined,
      size: this.filters.size ? Number(this.filters.size) : undefined, // Convert size to a number
      status: this.filters.status || undefined,
    };

    this.dineIntableService.getList(inputWithFilters as GetDiniTableInput).subscribe({
      next: (response) => {
        console.log(response);
        this.tables = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages

        this.tableData = this.tables.map(table => ({
          name: table.name,
          size: table.size,
          status: table.status ? 'Active' : 'Inactive'
        }));
      },
      error: (err) => {
        console.error('Error loading tables:', err);
      },
    });
  }

  openAddEditModal(table?: UpdateDinInTable): void {
    const modalRef = this.modalService.open(AddDiningTablesComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.table = table || null;

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

  openConfirmDeleteModal(tableId: number, tableName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = tableId;
    modalRef.componentInstance.name = tableName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteDiningTable(id); // Call the delete method with the table ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteDiningTable(id: number): void {
    this.dineIntableService.delete(id).subscribe({
      next: () => {
        this.tables = this.tables.filter((table) => table.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting table:', err);
      },
    });
  }

  onPageChange(page: number): void {
    console.log('Page changed:', page);
    this.currentPage = page;
    this.loadDiningTables();
  }

  downloadQRCode(table: any) {
    console.log('Download QR code:', table);
    if (table?.url) {
      const qrCodeUrl = table.url; // The URL to the image file

      // Fetch the image as a Blob
      fetch(qrCodeUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); // Convert the response to a Blob
        })
        .then(blob => {
          // Create an object URL for the Blob
          const objectUrl = URL.createObjectURL(blob);

          // Create a link element
          const link = document.createElement('a');
          link.href = objectUrl;

          // Set the download attribute with a default filename
          link.download = `QRCode-${table.id}.png`; // Change the extension if needed

          // Append the link to the body (required for Firefox)
          document.body.appendChild(link);

          // Programmatically click the link to trigger the download
          link.click();

          // Revoke the object URL to free up memory
          URL.revokeObjectURL(objectUrl);

          // Remove the link from the DOM
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Failed to download QR code:', error);
        });
    } else {
      console.error('No QR code URL available for download.');
    }
  }


  openDiningTableDetailsAndNavigate(table: UpdateDinInTable) {
    this.router.navigate(['/dining-tables', table.id]);
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
    this.filters = { name: '', size: '', status: '' };
    this.loadDiningTables();
  }
}
