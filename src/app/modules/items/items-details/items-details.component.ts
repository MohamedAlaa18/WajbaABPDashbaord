import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/shared/table/table.component';
import { ItemAddonService, ItemExtraService, ItemService, ItemVariationService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVariationComponent } from '../add-variation/add-variation.component';
import { AddExtraComponent } from '../add-extra/add-extra.component';
import { AddOnsComponent } from '../add-ons/add-ons.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { ItemDto } from '@proxy/dtos/items-dtos';

@Component({
  selector: 'app-items-details',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './items-details.component.html',
  styleUrl: './items-details.component.scss'
})
export class ItemsDetailsComponent implements OnInit {
  activeSection: string = 'information';
  showVariationModal = false;
  showExtraModal = false;
  showAddonsModal = false;
  itemId!: number;
  item!: ItemDto;
  selectedVariation: any = null;
  selectedExtra: any = null;
  selectedAddon: any = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  variations: any[] = [];
  extras: any[] = [];
  addons: any[] = [];

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'additionalPrice', header: 'Additional Price' },
    { field: 'status', header: 'Status' },
  ];

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => {
        if (row.type === 'variation') {
          this.editVariation(row);
        } else if (row.type === 'extra') {
          this.editExtra(row);
        } else if (row.type === 'addon') {
          this.editAddon(row);
        }
      },
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => {
        if (row.type === 'variation') {
          this.openConfirmDeleteModal(row.id, row.name, 'variation');
        } else if (row.type === 'extra') {
          this.openConfirmDeleteModal(row.id, row.name, 'extra');
        } else if (row.type === 'addon') {
          this.openConfirmDeleteModal(row.id, row.name, 'addon');
        }
      },
    },
  ];

  constructor(
    private itemService: ItemService,
    private variationService: ItemVariationService,
    private extraService: ItemExtraService,
    private addonsService: ItemAddonService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
    private modalService: NgbModal,
  ) {
    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.activeSection = localStorage.getItem('activeSection') || 'information';
    this.loadItem();
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    localStorage.setItem('activeSection', section);
  }

  loadItem(): void {
    this.itemService.get(this.itemId).subscribe(
      (response) => {
        this.item = response.data;
        console.log(response);
        this.loadVariations(this.item.id);
        this.loadExtras(this.item.id);
        this.loadAddons(this.item.id);
      },
      (error) => {
        console.error('Error loading item:', error);
      }
    );
  }

  loadVariations(id: number): void {
    this.variationService.getVariationsByItemId(id).subscribe(
      (response) => {
        this.variations = response.data;
        console.log(response)
      },
      (error) => {
        console.error('Error loading variations:', error);
      }
    );
  }

  loadExtras(id: number): void {
    this.extraService.getExtrasByItemId(id).subscribe(
      (response) => {
        this.extras = response.data;
      },
      (error) => {
        console.error('Error loading extras:', error);
      }
    );
  }

  loadAddons(id: number): void {
    this.addonsService.getAddonsByItemId(id).subscribe(
      (response) => {
        this.addons = response.data;
        console.log(response)
      },
      (error) => {
        console.error('Error loading addons:', error);
      }
    );
  }

  openVariationModal(variation?: any): void {
    const modalRef = this.modalService.open(AddVariationComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.variation = variation || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadVariations(this.item.id); // Refresh the variations list
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openExtraModal(extra?: any): void {
    const modalRef = this.modalService.open(AddExtraComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.extra = extra || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadExtras(this.item.id); // Refresh the extras list
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openAddonsModal(addon?: any): void {
    const modalRef = this.modalService.open(AddOnsComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.addon = addon || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadAddons(this.item.id); // Refresh the addons list
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  editVariation(variation: any) {
    this.openVariationModal(variation);
  }

  editExtra(extra: any) {
    this.openExtraModal(extra);
  }

  editAddon(addon: any) {
    this.openAddonsModal(addon);
  }

  openConfirmDeleteModal(itemId: number, itemName: string, type: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = itemId;
    modalRef.componentInstance.name = itemName;

    // Handle modal result based on type
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      if (type === 'extra') {
        this.deleteExtra(itemId);
      } else if (type === 'addon') {
        this.deleteAddon(itemId);
      } else if (type === 'variation') {
        this.deleteVariation(itemId);
      }
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteExtra(extra: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.extraService.delete(extra.id, this.itemId).subscribe(() => {
        console.log(`Item with id ${extra.id} deleted successfully.`);
        // Refresh the items list after deletion
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${extra.id}:`, error);
      });
    }
  }

  deleteAddon(addon: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.addonsService.deleteAddonForItem(addon.id, this.itemId).subscribe(() => {
        console.log(`Item with id ${addon.id} deleted successfully.`);
        // Refresh the items list after deletion
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting item with id ${addon.id}:`, error);
      });
    }
  }

  deleteVariation(variation: any) {
    if (confirm('Are you sure you want to delete this variation?')) {
      this.variationService.delete(variation.itemattributesId, this.itemId).subscribe((response) => {
        console.log(`Variation with id ${variation.itemattributesId} deleted successfully.`, response);
        this.afterActionService.reloadCurrentRoute();
      }, (error) => {
        console.error(`Error deleting variation with id ${variation.itemattributesId}:`, error);
      });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
      this.updateItemImage(); // Call the image update method after selecting the file
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  updateItemImage(): void {
    if (this.selectedFile) {
      // this.itemService.updateItemImage(this.itemId, this.selectedFile).subscribe(
      //   (response) => {
      //     console.log('Image updated successfully:', response);
      //     this.afterActionService.reloadCurrentRoute();
      //   },
      //   (error) => {
      //     console.error('Error updating image:', error);
      //   }
      // );
    }
  }
}
