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
import { UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
import { UpdateItemExtraDto } from '@proxy/dtos/item-extra-contract';
import { UpdateItemAddonDto } from '@proxy/dtos/item-addon-contract';
import { Base64Service } from 'src/app/services/base64/base64.service';

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

  selectedFile: File | null = null;

  variations: UpdateItemVariationDto[] = [];
  extras: UpdateItemExtraDto[] = [];
  addons: UpdateItemAddonDto[] = [];

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
        if (this.variations.includes(row)) {
          this.editVariation(row);
        } else if (this.extras.includes(row)) {
          this.editExtra(row);
        } else if (this.addons.includes(row)) {
          this.editAddon(row);
        } else {
          console.error('Unknown type for row:', row);
        }
      },
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => {
        if (this.variations.includes(row)) {
          this.openConfirmDeleteModal(row.id, row.name, 'variation');
        } else if (this.extras.includes(row)) {
          this.openConfirmDeleteModal(row.id, row.name, 'extra');
        } else if (this.addons.includes(row)) {
          this.openConfirmDeleteModal(row.id, row.name, 'addon');
        } else {
          console.error('Unknown type for row:', row);
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
    private base64Service: Base64Service,
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
        console.log(response)
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
    modalRef.componentInstance.itemId = this.itemId || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    // modalRef.result
    //   .then((result) => {
    //     if (result === 'saved') {
    //       this.loadVariations(this.item.id); // Refresh the variations list
    //     }
    //   })
    //   .catch((reason) => {
    //     console.log('Modal dismissed:', reason);
    //   });
  }

  openExtraModal(extra?: any): void {
    const modalRef = this.modalService.open(AddExtraComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.extra = extra || null;
    modalRef.componentInstance.itemId = this.itemId || null;

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
    modalRef.componentInstance.itemId = this.itemId || null;

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
      modalRef.close();
      this.afterActionService.reloadCurrentRoute();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteExtra(extraId: number) {
    this.extraService.delete(this.itemId, extraId).subscribe(() => {
      console.log(`Item with id ${extraId} deleted successfully.`);
      // Refresh the items list after deletion
      this.afterActionService.reloadCurrentRoute();
    }, (error) => {
      console.error(`Error deleting item with id ${extraId}:`, error);
    });
  }

  deleteAddon(addonId: number) {
    this.addonsService.deleteAddonForItem(this.itemId, addonId).subscribe(() => {
      console.log(`Item with id ${addonId} deleted successfully.`);
      // Refresh the items list after deletion
      this.afterActionService.reloadCurrentRoute();
    }, (error) => {
      console.error(`Error deleting item with id ${addonId}:`, error);
    });
  }

  deleteVariation(variationId: number) {
    this.variationService.delete(this.itemId, variationId).subscribe((response) => {
      console.log(`Variation with id ${variationId} deleted successfully.`, response);
      this.afterActionService.reloadCurrentRoute();
    }, (error) => {
      console.error(`Error deleting variation with id ${variationId}:`, error);
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.updateItemImage();
    } else {
      this.selectedFile = null;
    }
  }

  updateItemImage(): void {
    if (this.selectedFile) {
      this.base64Service.convertToBase64(this.selectedFile).then(
        (base64Content) => {
          const imageMode = {
            fileName: this.selectedFile?.name,
            base64Content: base64Content
          };

          this.itemService.updatImageByIdAndModel(this.itemId, imageMode).subscribe(
            (response) => {
              console.log('Image updated successfully:', response);
              this.afterActionService.reloadCurrentRoute();
            },
            (error) => {
              console.error('Error updating image:', error);
            }
          );
        },
        (error) => {
          console.error('Error converting file to Base64:', error);
        }
      );
    }
  }
}
