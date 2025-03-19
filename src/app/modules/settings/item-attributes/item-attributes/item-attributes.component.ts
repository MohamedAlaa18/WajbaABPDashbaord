import { Component } from '@angular/core';
import { TableComponent } from 'src/app/shared/table/table.component';
import { SettingsSidebarComponent } from '../../settings-sidebar/settings-sidebar.component';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemAttributeService } from '@proxy/controllers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { AddItemAttributesComponent } from '../add-item-attributes/add-item-attributes.component';
import { UpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { PaginationComponent } from "../../../../shared/pagination/pagination.component";

@Component({
  selector: 'app-item-attributes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsComponent, SettingsSidebarComponent, TableComponent, PaginationComponent],
  templateUrl: './item-attributes.component.html',
  styleUrl: './item-attributes.component.scss'
})
export class ItemAttributesComponent {
  itemAttributes: UpdateItemAttributeDto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
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
    private modalService: NgbModal,
    private itemAttributeService: ItemAttributeService,
    private afterActionService: AfterActionService,
  ) { }

  ngOnInit(): void {
    this.loadItemAttributes();
  }

  // Load all item attributes
  loadItemAttributes(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10
    };

    this.itemAttributeService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.itemAttributes = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages
      },
      error: (err) => {
        console.error('Error loading item attributes:', err);
      },
    });
  }

  openAddEditModal(itemAttribute?: UpdateItemAttributeDto): void {
    const modalRef = this.modalService.open(AddItemAttributesComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.itemAttribute = itemAttribute || null;

    modalRef.componentInstance.close.subscribe(() => {
      this.afterActionService.reloadCurrentRoute();
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.afterActionService.reloadCurrentRoute();
          modalRef.close();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(itemAttributeId: number, itemAttributeName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = itemAttributeId;
    modalRef.componentInstance.name = itemAttributeName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteItemAttribute(id); // Call the delete method with the item attribute ID
      this.afterActionService.reloadCurrentRoute();
      modalRef.close();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      this.afterActionService.reloadCurrentRoute();
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteItemAttribute(id: number): void {
    this.itemAttributeService.delete(id).subscribe({
      next: () => {
        this.itemAttributes = this.itemAttributes.filter((attribute) => attribute.id !== id);
        this.modalService.dismissAll(); // Close all modals
        this.afterActionService.reloadCurrentRoute();
      },
      error: (err) => {
        console.error('Error deleting item attribute:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItemAttributes();
  }
}
