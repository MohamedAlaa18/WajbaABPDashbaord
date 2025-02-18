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
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { CouponService } from '@proxy/controllers';
import { AddPointsComponent } from '../add-points/add-points.component';
import { ItemDto } from '@proxy/dtos/items-dtos';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './points.component.html',
  styleUrl: './points.component.scss'
})
export class PointsComponent implements OnInit {
  vouchers: UpdateCoupondto[] = [];
  items: ItemDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'points', header: 'Points' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { name: string; category: number; points: number; price: number; status: string }[] = [];

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
    private couponService: CouponService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadVouchers();
  }

  // Load all vouchers
  loadVouchers(): void {
    const defaultInput: GetCouponsInput = {
      branchid: 1,
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,

    };

    this.couponService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.vouchers = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10);

        // this.tableData = this.vouchers.map(voucher => ({
        //   name: voucher.name,
        //   code: voucher.code,
        //   discount: voucher.discount,
        //   startDate: voucher.startDate,
        //   endDate: voucher.endDate,
        //   type: voucher.discountType === 1 ? 'Percentage' : 'Fixed'
        // }));
      },
      error: (err) => {
        console.error('Error loading vouchers:', err);
      },
    });
  }

  openAddEditModal(voucher?: UpdateCoupondto): void {
    const modalRef = this.modalService.open(AddPointsComponent, {
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
      item: '',
      points: '',
      price: '',
      status: '',
    };
    this.loadVouchers();
  }
}
