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
import { GetOfferInput, UpdateOfferdto } from '@proxy/dtos/offers-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  offers: UpdateOfferdto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'discountPercentage', header: 'Discount' },
    { field: 'startDate', header: 'StartDate' },
    { field: 'endDate', header: 'EndDate' },
    { field: 'discountType', header: 'Type' },
  ];

  tableData: { name: string; discountPercentage: number; startDate: string; endDate: string, discountType: string }[] = [];

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

  filterFields = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Amount', name: 'amount', type: 'number' },
    { label: 'Start date', name: 'startDate', type: 'date' },
    { label: 'End date', name: 'endDate', type: 'date' },
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
    amount: '',
    startDate: '',
    endDate: '',
    status: null
  };

  constructor(
    private modalService: NgbModal,
    private offerService: OfferService,
    private afterActionService: AfterActionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadOffers();
  }

  // Load all offers
  loadOffers(): void {
    const input: GetOfferInput = {
      name: this.filters.name || undefined,
      status: this.filters.status ? this.filters.status : undefined,
      startDate: this.filters.startDate || undefined,
      endDate: this.filters.endDate || undefined,
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
    };

    this.offerService.getList(input).subscribe({
      next: (response) => {
        console.log('Offers loaded:', response);
        this.offers = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages

        this.tableData = this.offers.map(offer => ({
          name: offer.name,
          discountPercentage: offer.discountPercentage,
          startDate: offer.startDate,
          endDate: offer.endDate,
          discountType: offer.discountType === 1 ? 'Percentage' : 'Amount'
        }));
      },
      error: (err) => {
        console.error('Error loading offers:', err);
      },
    });
  }

  openAddEditModal(offer?: UpdateOfferdto): void {
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
      this.afterActionService.reloadCurrentRoute();
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOffers();
  }

  openBranchDetailsAndNavigate(offer: UpdateOfferdto) {
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
      status: null
    };
    this.loadOffers();
  }
}
