import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { ItemService } from '@proxy/controllers';
import { AddPointsComponent } from '../add-points/add-points.component';
import { GetItemInput, ItemDto } from '@proxy/dtos/items-dtos';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './points.component.html',
  styleUrl: './points.component.scss'
})
export class PointsComponent implements OnInit {
  items: ItemDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'categoryName', header: 'Category' },
    { field: 'points', header: 'Points' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { name: string; categoryName: string; points: number; price: number; status: string }[] = [];

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
    }
  ];

  filterFields = [
    {
      label: 'Item', name: 'item', type: 'select',
      options: this.items.map(item => ({
        label: item.name,
        value: item.id
      }))
    },
    { label: 'Points', name: 'points', type: 'number' },
    { label: 'Price', name: 'price', type: 'number' },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },
  ];

  filters = {
    item: '',
    points: '',
    price: '',
    status: '',
  };

  constructor(
    private modalService: NgbModal,
    private itemService: ItemService,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  // Load all items
  loadItems(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const input: GetItemInput = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
      // points: this.filters.points ? Number(this.filters.points) : undefined,
      status: this.filters.status ? Number(this.filters.status) : undefined,
      minPrice: this.filters.price ? Number(this.filters.price) : undefined,
      maxPrice: this.filters.price ? Number(this.filters.price) : undefined,
      branchId: selectedBranch.id, // Add branch ID if needed
      itemId: this.filters.item ? Number(this.filters.item) : undefined,
    };

    this.itemService.getList(input).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages

        this.tableData = this.items.map(item => ({
          name: item.name,
          categoryName: item.categoryName,
          points: item.points,
          price: item.price,
          status: item.status ? 'Active' : 'Inactive'
        }));
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  openAddEditModal(item?: UpdateCoupondto): void {
    const modalRef = this.modalService.open(AddPointsComponent, {
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
      this.deletePoints(id); // Call the delete method with the item ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deletePoints(id: number): void {
    this.itemService.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting points:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadItems();
  }

  clearFilters(): void {
    this.filters = {
      item: '',
      points: '',
      price: '',
      status: '',
    };
    this.loadItems();
  }
}
