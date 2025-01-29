import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { CategoryService, CouponService, ItemService } from '@proxy/controllers';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { TableComponent } from 'src/app/shared/table/table.component';
import { ExportButtonComponent } from 'src/app/shared/export-button/export-button.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import { UpdateCategory } from '@proxy/dtos/categories';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetBranchInput } from '@proxy/dtos/branch-contract';

@Component({
  selector: 'app-item-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './item-reports.component.html',
  styleUrl: './item-reports.component.scss'
})
export class ItemReportsComponent implements OnInit {
  vouchers: UpdateCoupondto[] = [];
  categories: UpdateCategory[] = [];
  items: ItemDto[] = [];

  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'type', header: 'Type' },
    { field: 'quantity', header: 'Quantity' },
  ];

  tableData: { name: string; category: string; type: string; quantity: number }[] = [];

  actions = [];

  filterFields = [
    {
      label: 'Category', name: 'category', type: 'select',
      options: this.categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
    {
      label: 'Item type', name: 'itemType', type: 'select',
      options: [
        { label: 'Veg', value: 1 },
        { label: 'Non Veg', value: 0 }
      ]
    },
    {
      label: 'Item Name', name: 'item', type: 'select',
      options: this.categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
    { label: 'Date', name: 'date', type: 'date' },
  ];

  filters = {
    category: '',
    item: '',
    itemType: '',
    date: '',
  };

  constructor(
    private modalService: NgbModal,
    private couponService: CouponService,
    private categoryService: CategoryService,
    private itemService: ItemService,
  ) { }

  ngOnInit(): void {
    this.loadPushNotification();
    this.loadCategory();
    this.loadItems();
  }

  // Load all vouchers
  loadPushNotification(): void {
    const defaultInput: GetCouponsInput = {
      branchid: 1,
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
      // name: this.filters.name || '',
      // code: this.filters.code || '',
      // discount: this.filters.discount ? +this.filters.discount : undefined,
      // discountype: this.filters.discountType ? +this.filters.discountType : undefined,
      // startdate: this.filters.startDate || '',
      // enddate: this.filters.endDate || '',
      // maximumDiscount: this.filters.maximumDiscount ? +this.filters.maximumDiscount : undefined,
    };

    this.couponService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.vouchers = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10);

        // this.tableData = this.vouchers.map(voucher => ({
        //   name: voucher.name,
        //   category: voucher.category,
        //   quantity: voucher.quantity,
        //   type: voucher.discountType === 1 ? 'Percentage' : 'Fixed'
        // }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      },
    });
  }

  loadItems(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
        this.updateFilterFields();
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
      if (field.name === 'item') {
        return {
          ...field,
          options: this.items.map(tax => ({
            label: tax.name,
            value: tax.id
          }))
        };
      }
      return field;
    });
  }

  openConfirmDeleteModal(voucherId: number, voucherName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = voucherId;
    modalRef.componentInstance.name = voucherName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteVoucher(id); // Call the delete method with the voucher ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteVoucher(id: number): void {
    this.couponService.delete(id).subscribe({
      next: () => {
        this.vouchers = this.vouchers.filter((voucher) => voucher.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting voucher:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPushNotification();
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadPushNotification();
  }

  clearFilters(): void {
    this.filters = {
      category: '',
      item: '',
      itemType: '',
      date: '',
    };
    this.loadPushNotification();
  }
}
