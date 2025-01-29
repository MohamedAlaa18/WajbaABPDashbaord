import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { CouponService } from '@proxy/controllers';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { TableComponent } from 'src/app/shared/table/table.component';
import { ExportButtonComponent } from 'src/app/shared/export-button/export-button.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';

@Component({
  selector: 'app-refer-a-friend',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './refer-a-friend.component.html',
  styleUrl: './refer-a-friend.component.scss'
})
export class ReferAFriendComponent implements OnInit {
  vouchers: UpdateCoupondto[] = [];

  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'customer', header: 'Customer' },
    { field: 'friend', header: 'Friend' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { customer: string; friend: string; startDate: string; endDate: string, status: number }[] = [];

  actions = [
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  filterFields = [
    { label: 'Customer', name: 'customer', type: 'text' },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    }
  ];

  filters = {
    customer: '',
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    private couponService: CouponService,
  ) { }

  ngOnInit(): void {
    this.loadPushNotification();
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
        //   customer:voucher.customer,
        //   friend: voucher.friend,
        //   startDate: voucher.startDate,
        //   endDate: voucher.endDate,
        //   status: voucher.status
        // }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      },
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
      customer: '',
      status: ''
    };
    this.loadPushNotification();
  }
}
