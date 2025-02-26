import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { CategoryService, ItemService, ItemTaxService } from '@proxy/controllers';
import { GetItemInput, ItemDto } from '@proxy/dtos/items-dtos';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { GetBranchInput } from '@proxy/dtos/branch-contract';
import { UpdateCategory } from '@proxy/dtos/categories';
import { UpdateItemTaxDto } from '@proxy/dtos/item-tax-contract';
import { PaginationComponent } from "../../../shared/pagination/pagination.component";
import { FilterComponent } from "../../../shared/filter/filter.component";

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent, ExportButtonComponent, PaginationComponent, FilterComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  items: ItemDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  categories: UpdateCategory[] = [];
  taxes: UpdateItemTaxDto[] = [];

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'categoryName', header: 'Category' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { name: string; categoryName: string; price: number; status: string }[] = [];

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
      callback: (row: any) => this.openItemDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Price', name: 'price', type: 'number' },
    {
      label: 'Category', name: 'category', type: 'select',
      options: this.categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
    {
      label: 'Tax', name: 'tax', type: 'select',
      options: this.taxes.map(tax => ({
        label: tax.name,
        value: tax.id
      }))
    },
    {
      label: 'ItemType', name: 'itemType', type: 'select',
      options: [
        { label: 'Veg', value: 1 },
        { label: 'Non Veg', value: 0 }
      ]
    },
    {
      label: 'Is featured', name: 'isFeatured', type: 'select',
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]
    },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },
  ];

  filters = {
    name: '',
    price: '',
    category: '',
    tax: '',
    itemType: '',
    isFeatured: '',
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private itemTaxService: ItemTaxService,
    private afterActionService: AfterActionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
    this.loadCategory();
    this.loadTaxes();
  }

  // Load all items
  loadItems(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const input: GetItemInput = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
      name: this.filters.name,
      categoryId: this.filters.category ? Number(this.filters.category) : undefined,
      itemType: this.filters.itemType ? Number(this.filters.itemType) : undefined,
      isFeatured: this.filters.isFeatured ? Boolean(Number(this.filters.isFeatured)) : undefined,
      status: this.filters.status ? Number(this.filters.status) : undefined,
      minPrice: this.filters.price ? Number(this.filters.price) : undefined,
      maxPrice: this.filters.price ? Number(this.filters.price) : undefined,
      branchId: selectedBranch.id, // Add branch ID if needed
      itemId: undefined, // Add specific item ID if needed
    };

    this.itemService.getList(input).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages

        this.tableData = this.items.map(item => ({
          name: item.name,
          categoryName: item.categoryName,
          price: item.price,
          status: item.status ? 'Active' : 'Inactive'
        }));
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  loadCategory(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.categoryService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.categories = response.data.items;
        this.updateFilterFields();
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadTaxes(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemTaxService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.taxes = response.data.items;
        this.updateFilterFields();
      },
      error: (error) => {
        console.error('Error fetching taxes:', error);
      }
    });
  }

  updateFilterFields(): void {
    this.filterFields = this.filterFields.map(field => {
      if (field.name === 'category') {
        return {
          ...field,
          options: this.categories.map(category => ({
            label: category.name,
            value: category.id
          }))
        };
      }
      if (field.name === 'tax') {
        return {
          ...field,
          options: this.taxes.map(tax => ({
            label: tax.name,
            value: tax.id
          }))
        };
      }
      return field;
    });
  }

  openAddEditModal(item?: ItemDto): void {
    const modalRef = this.modalService.open(AddItemsComponent, {
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
      this.afterActionService.reloadCurrentRoute();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteItem(id: number): void {
    this.itemService.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  openItemDetailsAndNavigate(item: ItemDto) {
    this.router.navigate(['/items', item.id]);
  }

  applyFilters(filters: any): void {
    this.filters = { ...filters }; // Spread to ensure new reference
    this.currentPage = 1; // Reset to the first page
    this.loadItems();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      price: '',
      category: '',
      tax: '',
      itemType: '',
      isFeatured: '',
      status: ''
    };
    this.loadItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }
}
