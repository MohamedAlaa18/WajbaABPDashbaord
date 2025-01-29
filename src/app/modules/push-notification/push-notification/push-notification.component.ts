import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { CouponService } from '@proxy/controllers';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { AddPushNotificationComponent } from '../add-push-notification/add-push-notification.component';

@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.scss'
})
export class PushNotificationComponent {
  vouchers: UpdateCoupondto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Title' },
    { field: 'code', header: 'Role' },
    { field: 'discount', header: 'User' },
    { field: 'startDate', header: 'Date' },
  ];

  tableData: { name: string; code: number; discount: number; startDate: string, endDate: string, type: string }[] = [];

  actions = [
    // {
    //   icon: 'assets/images/edit.svg',
    //   tooltip: 'Edit',
    //   show: (row: any) => true,
    //   callback: (row: any) => this.openAddEditModal(row),
    // },
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openPushNotificationDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    }
  ];

  filterFields = [
    { label: 'Title', name: 'name', type: 'text' },
    {
      label: 'Role', name: 'role', type: 'select',
      options: [
        { label: 'POS Operator', value: 1 },
        { label: 'Staff', value: 2 },
        { label: 'Branch Manager', value: 3 },
      ]
    },
    {
      label: 'User', name: 'user', type: 'select',
      options: [
        { label: 'POS Operator', value: 1 },
        { label: 'Staff', value: 2 },
        { label: 'Branch Manager', value: 3 },
      ]
    },
    { label: 'Date', name: 'date', type: 'date' },
  ];

  filters = {
    title: '',
    role: '',
    user: '',
    date: '',
  };

  constructor(
    private modalService: NgbModal,
    private couponService: CouponService,
    private router: Router,
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

        this.tableData = this.vouchers.map(voucher => ({
          name: voucher.name,
          code: voucher.code,
          discount: voucher.discount,
          startDate: voucher.startDate,
          endDate: voucher.endDate,
          type: voucher.discountType === 1 ? 'Percentage' : 'Fixed'
        }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      },
    });
  }

  openAddEditModal(voucher?: UpdateCoupondto): void {
    const modalRef = this.modalService.open(AddPushNotificationComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.voucher = voucher || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadPushNotification();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
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

  openPushNotificationDetailsAndNavigate(notification: UpdateCoupondto) {
    console.log(notification)
    this.router.navigate(['/push-notification', notification.id]);
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
      title: '',
      role: '',
      user: '',
      date: '',
    };
    this.loadPushNotification();
  }
}
