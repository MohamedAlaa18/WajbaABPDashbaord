import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UpadteCurrency } from '@proxy/dtos/currencies-contract';
import { CurrenciesService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCurrenciesComponent } from '../add-currencies/add-currencies.component';
import { SettingsSidebarComponent } from "../../settings-sidebar/settings-sidebar.component";
import { TableComponent } from "../../../../shared/table/table.component";
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';

@Component({
  selector: 'app-currencies',
  standalone: true,
  imports: [CommonModule, RouterModule, IconsComponent, SettingsSidebarComponent, TableComponent],
  templateUrl: './currencies.component.html',
  styleUrl: './currencies.component.scss'
})
export class CurrenciesComponent {
  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;
  currencies: UpadteCurrency[] = [];
  selectedCurrency: UpadteCurrency | null = null;

  isConfirmDeleteModalOpen: boolean = false;
  currencyToDeleteId!: number;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'symbol', header: 'Symbol' },
    { field: 'code', header: 'Code' },
    { field: 'exchangeRate', header: 'Exchange Rate' }
  ];

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
    },
  ];

  constructor(
    private CurrenciesService: CurrenciesService,
    private afterActionService: AfterActionService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies() {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.CurrenciesService.getList(defaultInput).subscribe((response: any) => {
      if (response) {
        this.currencies = response.data.items;
        console.log("currency : " + response.data.items)
      } else {
        console.error('The response is not an array:', response);
        this.currencies = [];
      }
    }, (error) => {
      console.error('Failed to load currencies:', error);
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openAddEditModal(currency?: UpadteCurrency): void {
    const modalRef = this.modalService.open(AddCurrenciesComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.currency = currency || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadCurrencies();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(currencyId: number, currencyName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = currencyId;
    modalRef.componentInstance.name = currencyName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteCurrency(id); // Call the delete method with the currency ID
      modalRef.close();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteCurrency(id: number): void {
    this.CurrenciesService.delete(id).subscribe(() => {
      console.log(`Currency with id: ${id} deleted successfully.`);
      this.afterActionService.reloadCurrentRoute();
    }, (error) => {
      console.error('Failed to delete currency:', error);
    });
  }
}
