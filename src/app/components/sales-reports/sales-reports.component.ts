import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { CouponService, ItemService } from '@proxy/controllers';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { TableComponent } from 'src/app/shared/table/table.component';
import { ExportButtonComponent } from 'src/app/shared/export-button/export-button.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetBranchInput } from '@proxy/dtos/branch-contract';


@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './sales-reports.component.html',
  styleUrl: './sales-reports.component.scss'
})
export class SalesReportsComponent implements OnInit {
  vouchers: UpdateCoupondto[] = [];
  deliveryBoys: ItemDto[] = [];

  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'id', header: 'Order ID' },
    { field: 'date', header: 'Date' },
    { field: 'total', header: 'Total' },
    { field: 'discount', header: 'Discount' },
    { field: 'deliveryCharge', header: 'Delivery charge' },
    { field: 'paymentType', header: 'Payment Type' },
    { field: 'paymentStatus', header: 'Payment Status' },
  ];

  tableData: { id: string; date: string; total: number; discount: number, deliveryCharge: number, paymentType: string, paymentStatus: string }[] = [];

  actions = [];

  filterFields = [
    { label: 'Order Serial No', name: 'id', type: 'text' },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    },
    {
      label: 'Payment method', name: 'paymentMethod', type: 'select',
      options: [
        { label: 'Cash', value: 1 },
        { label: 'Visa', value: 0 }
      ]
    },
    {
      label: 'Source', name: 'source', type: 'select',
      options: [
        { label: 'POS Order', value: 1 },
        { label: 'Web', value: 2 },
        { label: 'App', value: 3 },
      ]
    },
    { label: 'Date', name: 'date', type: 'date' },
    {
      label: 'Paid status', name: 'paidStatus', type: 'select',
      options: [
        { label: 'Paid', value: 1 },
        { label: 'UnPaid', value: 0 }
      ]
    },
    {
      label: 'Delivery boy', name: 'deliveryBoy', type: 'select',
      options: this.deliveryBoys.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
  ];

  filters = {
    id: '',
    status: '',
    paymentMethod: '',
    source: '',
    date: '',
    paidStatus: '',
    deliveryBoy: '',
  };

  constructor(
    private modalService: NgbModal,
    // private orderService: OrderService,
    private itemService: ItemService,) { }

  ngOnInit(): void {
    this.loadPushNotification();
    this.loadItems();
  }

  // Load all vouchers
  loadPushNotification(): void {
    const defaultInput: GetCouponsInput = {
      branchid: 1,
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
    };

    // this.orderService.salesReportByBranchIdAndStartDateAndEndDateAndDateorderAndStatusAndOrdertypeAndOrderIdAndFrompriceAndTopriceAndPaidstatusAndPageNumberAndPageSize(
    //   1,
    //   undefined,// startDate (you can add this if needed)
    //   undefined, // endDate (you can add this if needed)
    //   this.filters.date || undefined, // dateorder
    //   this.filters.status ? +this.filters.status : undefined,
    //   undefined, // ordertype
    //   this.filters.id ? +this.filters.id : undefined,
    //   undefined, // fromprice
    //   undefined, // toprice
    //   this.filters.paidStatus ? this.filters.paidStatus : undefined,
    //   this.currentPage,
    //   10
    // ).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.vouchers = response.data.items;
    //     this.totalPages = Math.ceil(response.data.totalCount / 10);
    //   },
    //   error: (err) => {
    //     console.error('Error loading vouchers:', err);
    //   },
    // });
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
        this.deliveryBoys = response.data.items;
        this.updateFilterFields();
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  updateFilterFields(): void {
    this.filterFields = this.filterFields.map(field => {
      if (field.name === 'deliveryBoy') {
        return {
          ...field,
          options: this.deliveryBoys.map(category => ({
            label: category.name,
            value: category.id
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
    // this.orderService.delete(id).subscribe({
    //   next: () => {
    //     this.vouchers = this.vouchers.filter((voucher) => voucher.id !== id);
    //     this.modalService.dismissAll(); // Close all modals
    //   },
    //   error: (err) => {
    //     console.error('Error deleting voucher:', err);
    //   },
    // });
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
      id: '',
      status: '',
      paymentMethod: '',
      source: '',
      date: '',
      paidStatus: '',
      deliveryBoy: '',
    };
    this.loadPushNotification();
  }
}
