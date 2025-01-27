import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { OfferDto } from '@proxy/dtos/offers-contract';
import { TableComponent } from "../../../shared/table/table.component";
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { CategoryDto } from '@proxy/dtos/categories';
import { ItemDto } from '@proxy/dtos/items-dtos';


@Component({
  selector: 'app-offers-details',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  templateUrl: './offers-details.component.html',
  styleUrl: './offers-details.component.scss',
  providers: [DatePipe]
})
export class OffersDetailsComponent implements OnInit {
  activeSection: string = 'information';
  showItemModal = false;
  offerId!: number;
  offer!: OfferDto;

  tableData: ItemDto[] | CategoryDto[] = [];

  selectedItem: any = null;
  selectedFile: File | null = null;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
  ];

  actions = [
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private offerService: OfferService,
    private afterActionService: AfterActionService,
    private modalService: NgbModal,
    private base64Service: Base64Service,
    private datePipe: DatePipe,
  ) {
    this.offerId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.loadOffer();
  }

  // Method to get offer details
  loadOffer() {
    if (this.offerId) {
      this.offerService.getById(this.offerId).subscribe(
        (response) => {
          console.log(response);
          this.offer = response.data;
          this.offer.itemDtos.length > 0 ? this.tableData = this.offer.itemDtos : this.tableData = this.offer.categoryDtos;
        },
        (error) => {
          console.error('Error fetching offer details:', error);
        }
      );
    }
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
      this.offer.itemDtos.length > 0 ?
        this.deleteItem(id) :
        this.deleteCategory(id);

      modalRef.close();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteItem(itemId: number) {
    this.offerService.deleteItemsByOfferidAndItemid(this.offerId, itemId).subscribe({
      next: (response) => {
        console.log(`Items removed from offer ${itemId}`, response);
        this.afterActionService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error removing items:', err)
    });
  }

  deleteCategory(categoryId: number) {
    this.offerService.deletecategorysByOfferidAndCategoryid(this.offerId, categoryId).subscribe({
      next: (response) => {
        console.log(`Category removed from offer ${categoryId}`, response);
        this.afterActionService.reloadCurrentRoute();
      },
      error: (err) => console.error('Error removing categories:', err)
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.updateOfferImage();
    } else {
      this.selectedFile = null;
    }
  }

  updateOfferImage(): void {
    if (this.selectedFile) {
      this.base64Service.convertToBase64(this.selectedFile).then(
        (base64Content) => {
          const imageMode = {
            fileName: this.selectedFile?.name,
            base64Content: base64Content
          };

          this.offerService.updateimageByIdAndModel(this.offerId, imageMode).subscribe(
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

  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'mediumDate');  // 'mediumDate' gives a readable format
  }
}
