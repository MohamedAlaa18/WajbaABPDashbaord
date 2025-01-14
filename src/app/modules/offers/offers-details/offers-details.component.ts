import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { UpdateOfferdto } from '@proxy/dtos/offers-contract';


@Component({
  selector: 'app-offers-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers-details.component.html',
  styleUrl: './offers-details.component.scss'
})
export class OffersDetailsComponent implements OnInit {
  activeSection: string = 'information';
  showItemModal = false;
  offerId!: number;
  offer!: UpdateOfferdto;
  selectedItem: any = null;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  isConfirmDeleteCategoryModalOpen: boolean = false;
  categoryToDeleteId!: number;
  isConfirmDeleteItemModalOpen: boolean = false;
  itemToDeleteId!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private offerService: OfferService,
    private afterActionService: AfterActionService,
  ) {
    this.offerId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getOfferDetails();
  }

  // Method to get offer details
  getOfferDetails() {
    if (this.offerId) {
      this.offerService.getById(this.offerId).subscribe(
        (response) => {
          this.offer = response.data;
          console.log('Offer details:', response);
        },
        (error) => {
          console.error('Error fetching offer details:', error);
        }
      );
    }
  }

  openItemModal() {
    this.showItemModal = true;
  }

  closeItemModal() {
    this.showItemModal = false;
  }

  saveItem() {
    console.log('Selected Item:', this.selectedItem);
    this.closeItemModal();
  }

  deleteItem(itemId: number) { }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.selectedFile = input.files[0];
      this.updateItemImage();
    } else {
      this.selectedFileName = null;
      this.selectedFile = null;
    }
  }

  updateItemImage(): void {
    if (this.selectedFile) {
      // this.offerService.updateImage(this.offerId, this.selectedFile).subscribe(
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

  openConfirmDeleteItemModal(id: number) {
    this.itemToDeleteId = id;
    this.isConfirmDeleteItemModalOpen = true;
  }

  openConfirmDeleteCategoryModal(id: number) {
    this.categoryToDeleteId = id;
    this.isConfirmDeleteCategoryModalOpen = true;
  }


  removeItems(): void {
    if (this.itemToDeleteId) {
      // this.offerService.removeItemsFromOffer(this.itemToDeleteId).subscribe({
      //   next: (response) => {
      //     console.log(`Items removed from offer ${this.itemToDeleteId}`, response);
      //     this.afterActionService.reloadCurrentRoute();
      //   },
      //   error: (err) => console.error('Error removing items:', err)
      // });
    }
  }

  removeCategories(): void {
    if (this.categoryToDeleteId) {
      // this.offerService.removeCategoriesFromOffer(this.categoryToDeleteId).subscribe({
      //   next: (response) => {
      //     console.log(`Categories removed from offer ${this.categoryToDeleteId}`, response);
      //     this.afterActionService.reloadCurrentRoute();
      //   },
      //   error: (err) => console.error('Error removing categories:', err)
      // });
    }
  }
}
