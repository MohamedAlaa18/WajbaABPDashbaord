import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopularItemService } from '@proxy/controllers';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { AddPopularTodayComponent } from '../add-popular-today/add-popular-today.component';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";
import { ExportService } from 'src/app/services/export/export.service';

@Component({
  selector: 'app-popular-today',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsComponent, TableComponent, PaginationComponent],
  templateUrl: './popular-today.component.html',
  styleUrl: './popular-today.component.scss'
})
export class PopularTodayComponent implements OnInit {
  branches: UpdateBranchDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;
  isMenuOpen: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
  ];

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => this.openAddEditModal(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  headers: string[] = ['Name', 'Category', 'PreviousPrice', 'CurrentPrice', 'Status'];
  tableData: { Name: string; Category: string; PreviousPrice: number; CurrentPrice: number, Status: boolean }[] = [];

  constructor(
    private modalService: NgbModal,
    private popularItemService: PopularItemService,
    private exportService: ExportService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  // Load all branches
  loadItems(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.popularItemService.get(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.branches = response.data.items;
      },
      error: (err) => {
        console.error('Error loading branches:', err);
      },
    });
  }

  openAddEditModal(branch?: UpdateBranchDto): void {
    const modalRef = this.modalService.open(AddPopularTodayComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.branch = branch || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadItems();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(branchId: number, branchName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = branchId;
    modalRef.componentInstance.name = branchName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteBranch(id); // Call the delete method with the branch ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }


  deleteBranch(id: number): void {
    this.popularItemService.delete(id).subscribe({
      next: () => {
        this.branches = this.branches.filter((branch) => branch.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting branch:', err);
      },
    });
  }

  exportXLS() {
    this.exportService.exportTableToXls(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  print() {
    this.exportService.exportTableToPdf(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }
}
