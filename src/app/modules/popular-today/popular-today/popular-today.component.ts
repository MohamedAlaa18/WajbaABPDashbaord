import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { AddPopularTodayComponent } from '../add-popular-today/add-popular-today.component';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";
import { Popularitemdto, UpdatePopularItemdto } from '@proxy/dtos/popular-itemstoday';
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { PopularItemsService } from '@proxy/controllers';

@Component({
  selector: 'app-popular-today',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, PaginationComponent, ExportButtonComponent],
  templateUrl: './popular-today.component.html',
  styleUrl: './popular-today.component.scss'
})
export class PopularTodayComponent implements OnInit {
  items: Popularitemdto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'categoryName', header: 'Category' },
    { field: 'prePrice', header: 'Previous Price' },
    { field: 'currentPrice', header: 'Current Price' },
  ];

  tableData: { name: string; categoryName: string; prePrice: number; currentPrice: number }[] = [];

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

  constructor(
    private modalService: NgbModal,
    private popularItemService: PopularItemsService,
    // private exportService: ExportService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  // Load all items
  loadItems(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.popularItemService.get(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.items = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages

        this.tableData = this.items.map(item => ({
          name: item.name,
          categoryName: item.categoryName,
          prePrice: item.prePrice,
          currentPrice: item.currentPrice,
        }));
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  openAddEditModal(item?: UpdatePopularItemdto): void {
    const modalRef = this.modalService.open(AddPopularTodayComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.item = item || null;

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

  openConfirmDeleteModal(itemId: number, itemName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = itemId;
    modalRef.componentInstance.name = itemName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteItem(id); // Call the delete method with the item ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }


  deleteItem(id: number): void {
    this.popularItemService.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }
}
