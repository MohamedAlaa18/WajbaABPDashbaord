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
import { ItemTaxService } from '@proxy/controllers';
import { GetCouponsInput, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { ItemTaxDto } from '@proxy/dtos/item-tax-contract';
import { GetBranchInput } from '@proxy/dtos/branch-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CreateOrderDto } from '@proxy/dtos/order-contract';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: CreateOrderDto[] = [];
  taxes: ItemTaxDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'id', header: 'Order ID' },
    { field: 'orderType', header: 'Order type' },
    { field: 'customerName', header: 'Customer name' },
    { field: 'amount', header: 'Amount' },
    { field: 'date', header: 'Date' },
    { field: 'status', header: 'Status' },
  ];

  tableData: { id: string; orderType: string; customerName: string; amount: number, date: string, status: string }[] = [];

  actions = [
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openOrderDetailsAndNavigate(row),
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
      label: 'Discount Type', name: 'discountType', type: 'select',
      options: this.taxes.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
    { label: 'Order ID', name: 'orderId', type: 'text' },
    { label: 'Price', name: 'price', type: 'number' },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Accepted', value: 1 },
        { label: 'Pending', value: 2 },
        { label: 'Rejected', value: 3 },
        { label: 'Out for delivery', value: 4 },
        { label: 'Delivered', value: 5 },
      ]
    },
    {
      label: 'Tax', name: 'tax', type: 'select',
      options: this.taxes.map(category => ({
        label: category.name,
        value: category.id
      }))
    },
    { label: 'From', name: 'startDate', type: 'date' },
    { label: 'To', name: 'endDate', type: 'date' },
  ];

  filters = {
    discountType: '',
    orderId: '',
    price: '',
    status: '',
    tax: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    private modalService: NgbModal,
    // private posOrderService: PosOrderService,
    private itemTaxService: ItemTaxService,
    private afterActionService:AfterActionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadTaxes();
  }

  // Load all vouchers
  loadOrders(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

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

    // this.posOrderService.getAllOrdersByBranchIdAndStartDateAndOrderIdAndOrderTypeAndEndDateAndDateOrderAndStatusAndFromPriceAndToPrice(selectedBranch.id).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //     this.orders = response.data.items;
    //     this.totalPages = Math.ceil(response.data.totalCount / 10);

    //     // this.tableData = this.orders.map(order => ({
    //     //   id:order.id,
    //     //   orderType:order.ordertype,
    //     //   customerName:order.customerName,
    //     //   amount:order.amount,
    //     //   date:order.date,
    //     //   status:order.status,
    //     // }));
    //   },
    //   error: (err) => {
    //     console.error('Error loading vouchers:', err);
    //   },
    // });
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
      if (field.name === 'discountType') {
        return {
          ...field,
          options: this.taxes.map(category => ({
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
    // this.posOrderService.deleteOrderByOrderId(id).subscribe({
    //   next: () => {
    //     // this.orders = this.orders.filter((voucher) => voucher.id !== id);
    //     this.afterActionService.reloadCurrentRoute();
    //     this.modalService.dismissAll(); // Close all modals
    //   },
    //   error: (err) => {
    //     console.error('Error deleting voucher:', err);
    //   },
    // });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  openOrderDetailsAndNavigate(order: UpdateCoupondto) {
    this.router.navigate(['/orders', order.id]);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadOrders();
  }

  clearFilters(): void {
    this.filters = {
      discountType: '',
      orderId: '',
      price: '',
      status: '',
      tax: '',
      startDate: '',
      endDate: '',
    };
    this.loadOrders();
  }
}
