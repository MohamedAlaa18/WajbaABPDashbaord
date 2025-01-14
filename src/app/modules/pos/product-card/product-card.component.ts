import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() productItem!: any;

  isAddModalOpen = false;

  constructor(
    private modalService: NgbModal
  ) { }

  openAddToCardModal(product?: any): void {
    const modalRef = this.modalService.open(AddToCartComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.product = product || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          // this.loadItems();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }
}
