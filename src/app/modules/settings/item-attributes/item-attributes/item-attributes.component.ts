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

@Component({
  selector: 'app-item-attributes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsComponent, SettingsSidebarComponent, TableComponent],
  templateUrl: './item-attributes.component.html',
  styleUrl: './item-attributes.component.scss'
})
export class ItemAttributesComponent {
  itemAttributes: UpdateItemAttributeDto[] = [];
  isAddMode = true;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
    { field: 'action', header: 'Action' },
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
  ) { }

  ngOnInit(): void {
    this.loadItemAttributes();
  }

  // Load all item attributes
  loadItemAttributes(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemAttributeService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        // this.itemAttributes = response.data.items;
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
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadItemAttributes();
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
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteItemAttribute(id: number): void {
    this.itemAttributeService.delete(id).subscribe({
      next: () => {
        // this.attributes = this.attributes.filter((attribute) => attribute.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting item attribute:', err);
      },
    });
  }
}
