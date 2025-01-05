import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { SettingsSidebarComponent } from '../../settings/settings-sidebar/settings-sidebar.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { ItemService } from '@proxy/controllers';
import { CreateItemDto } from '@proxy/dtos/items-dtos';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsComponent, SettingsSidebarComponent, TableComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  items: CreateItemDto[] = [];
  isAddMode = true;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'status', header: 'Status' },
    // { field: 'action', header: 'Action' },
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
      callback: (row: any) => this.openItemDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => row.status === 1, // Show only for active items
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  constructor(
    private modalService: NgbModal,
    private itemService: ItemService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  // Load all items
  loadItems(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  openAddEditModal(item?: CreateItemDto): void {
    const modalRef = this.modalService.open(AddItemsComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.item = item || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadItems();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(itemId: number, itemName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = itemId;
    modalRef.componentInstance.name = itemName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteItem(id); // Call the delete method with the item ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }


  deleteItem(id: number): void {
    this.itemService.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  openItemDetailsAndNavigate(item: CreateItemDto) {
    this.router.navigate(['/items', item.id]);
  }
}
