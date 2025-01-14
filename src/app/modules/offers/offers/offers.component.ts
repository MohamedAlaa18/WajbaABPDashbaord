import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfferService } from '@proxy/controllers';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { AddOffersComponent } from '../add-offers/add-offers.component';
import { CreateUpdateOfferDto } from '@proxy/offers-contract';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  offers: CreateUpdateOfferDto[] = [];
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
    { field: 'type', header: 'Type' },
  ];

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
      callback: (row: any) => this.openBranchDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    }
  ];

  headers: string[] = ['Name', 'Category', 'PreviousPrice', 'CurrentPrice', 'Status'];
  tableData: { Name: string; Category: string; PreviousPrice: number; CurrentPrice: number, Status: boolean }[] = [];

  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Amount', name: 'amount', type: 'number' },
    { label: 'Start date', name: 'startDate', type: 'date' },
    { label: 'End date', name: 'endDate', type: 'date' },
    {
      label: 'Status', name: 'status', type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
  ];

  filters = {
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: ''
  };

  constructor(
    private modalService: NgbModal,
    private offerService: OfferService,
    // private exportService: ExportService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  // Load all offers
  loadOffers(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.offerService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.offers = response.data.items;
      },
      error: (err) => {
        console.error('Error loading offers:', err);
      },
    });
  }

  handleMenuAction(action: string) {
    if (action === 'exportXLS') {
      this.exportXLS();
    } else if (action === 'print') {
      this.print();
    }
  }

  openAddEditModal(offer?: CreateUpdateOfferDto): void {
    const modalRef = this.modalService.open(AddOffersComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.offer = offer || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadOffers();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(offerId: number, offerName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = offerId;
    modalRef.componentInstance.name = offerName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteOffer(id); // Call the delete method with the offer ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteOffer(id: number): void {
    this.offerService.delete(id).subscribe({
      next: () => {
        this.offers = this.offers.filter((offer) => offer.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting offer:', err);
      },
    });
  }

  exportXLS() {
    // this.exportService.exportTableToXls(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  print() {
    // this.exportService.exportTableToPdf(this.tableData, this.headers, 'PopularItemsData');
    this.isMenuOpen = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOffers();
  }

  openBranchDetailsAndNavigate(offer: CreateUpdateOfferDto) {
    this.router.navigate(['/offers', offer.id]);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadOffers();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      amount: '',
      startDate: '',
      endDate: '',
      status: ''
    };
    this.loadOffers();
  }
}
