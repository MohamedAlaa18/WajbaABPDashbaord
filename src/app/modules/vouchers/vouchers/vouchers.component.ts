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
import { AddVouchersComponent } from '../add-vouchers/add-vouchers.component';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { CouponService } from '@proxy/controllers';

@Component({
  selector: 'app-vouchers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss'
})
export class VouchersComponent implements OnInit {
  vouchers: UpdateCoupondto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
    { field: 'discount', header: 'Discount' },
    { field: 'startDate', header: 'StartDate' },
    { field: 'endDate', header: 'EndDate' },
    { field: 'discountType', header: 'Type' },
  ];

  tableData: { name: string; code: number; discount: number; startDate: string, endDate: string, discountType: string }[] = [];

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
      callback: (row: any) => this.openVoucherDetailsAndNavigate(row),
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
    { label: 'Code', name: 'code', type: 'text' },
    { label: 'Discount', name: 'discount', type: 'number' },
    {
      label: 'Discount Type', name: 'discountType', type: 'select',
      options: [
        { label: 'Percentage', value: 1 },
        { label: 'Fixed', value: 0 }
      ]
    },
    { label: 'Start date', name: 'startDate', type: 'date' },
    { label: 'End date', name: 'endDate', type: 'date' },
    { label: 'Minimum Discount', name: 'minimumDiscount', type: 'number' },
    { label: 'Maximum Discount', name: 'maximum Discount', type: 'number' },
  ];

  filters = {
    name: '',
    code: '',
    discount: '',
    discountType: '',
    startDate: '',
    endDate: '',
    minimumDiscount: '',
    maximumDiscount: ''
  };

  constructor(
    private modalService: NgbModal,
    private couponService: CouponService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadVouchers();
  }

  // Load all vouchers
  loadVouchers(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const defaultInput: GetCouponsInput = {
      branchid: selectedBranch.id,
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
      name: this.filters.name || '',
      code: this.filters.code || '',
      discount: this.filters.discount ? Number(this.filters.discount) : undefined,
      discountype: this.filters.discountType ? Number(this.filters.discountType) : undefined,
      startdate: this.filters.startDate || '',
      enddate: this.filters.endDate || '',
      maximumDiscount: this.filters.maximumDiscount ? Number(this.filters.maximumDiscount) : undefined,
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
          discountType: voucher.discountType === 1 ? 'Percentage' : 'Fixed'
        }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      },
    });
  }

  openAddEditModal(voucher?: UpdateCoupondto): void {
    const modalRef = this.modalService.open(AddVouchersComponent, {
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
          this.loadVouchers();
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
    this.loadVouchers();
  }

  openVoucherDetailsAndNavigate(voucher: UpdateCoupondto) {
    this.router.navigate(['/vouchers', voucher.id]);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadVouchers();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      code: '',
      discount: '',
      discountType: '',
      startDate: '',
      endDate: '',
      minimumDiscount: '',
      maximumDiscount: ''
    };
    this.loadVouchers();
  }
}
