import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';


@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  imports: [CommonModule, IconsComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.scss'
})
export class AddToCartComponent implements OnChanges, OnInit {
  @Input() isModalOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() productItem!: any;
  @Input() cartItem!: any;
  @Output() closeModalEvent = new EventEmitter<void>();

  product!: any;
  quantity: number = 1;
  specialInstructions: string = '';
  cartForm!: FormGroup;

  addedExtras: { name: string; additionalPrice: number }[] = [];

  constructor(
    // private productService: ProductService,
    // private cartService: CartService,
    private fb: FormBuilder,
    // private snackbarService: SnackbarService,
    private afterActionService: AfterActionService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.addedExtras = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isModalOpen'] && this.isModalOpen) {
      if (this.isEditMode) {
        this.loadProductDetails(this.cartItem.itemId);
        this.quantity = this.cartItem.quantity;
      } else {
        this.loadProductDetails(this.productItem.id);
      }
      this.resetExtras();
    }
  }

  resetExtras() {
    this.addedExtras = [];
  }

  createForm() {
    this.cartForm = this.fb.group({
      quantity: [this.quantity],
      specialInstructions: [''],
      variations: this.fb.array([]),
      addons: this.fb.array([]),
      extras: this.fb.array([])
    });
  }

  loadProductDetails(itemId: number) {
    // this.productService.getProductItemDetails(itemId).subscribe(
    //   (productDetails) => {
    //     this.product = productDetails.data;
    //     this.populateForm();
    //   },
    //   (error) => {
    //     console.error('Error fetching product details:', error);
    //   }
    // );
  }

  populateForm() {
    this.cartForm.patchValue({
      quantity: this.quantity,
      specialInstructions: this.specialInstructions,
    });

    this.variations.clear();
    this.addons.clear();
    this.extra.clear();

    // Populate variations with required validation if attributes are present
    this.product.attributes.forEach((attribute) => {
      const control = this.fb.control(null, Validators.required);
      this.variations.push(control);
    });

    // Populate addons
    this.product.itemAddons.forEach(() => {
      const control = this.fb.control(false);
      this.addons.push(control);
    });

    // Populate extras
    this.product.itemExtras.forEach(() => {
      const control = this.fb.control(false);
      this.extra.push(control);
    });

    if (this.isEditMode) {
      this.cartForm.patchValue({
        specialInstructions: this.cartItem.notes,
        quantity: this.cartItem.quantity,
      });

      this.addedExtras = this.cartItem.extras || [];
    }
  }


  get variations(): FormArray {
    return this.cartForm.get('variations') as FormArray;
  }

  get addons(): FormArray {
    return this.cartForm.get('addons') as FormArray;
  }

  get extra(): FormArray {
    return this.cartForm.get('extras') as FormArray;
  }

  incrementQuantity(e: Event) {
    e.preventDefault();
    this.quantity += 1;
    this.cartForm.patchValue({ quantity: this.quantity });
  }

  decrementQuantity(e: Event) {
    e.preventDefault();
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.cartForm.patchValue({ quantity: this.quantity });
    }
  }

  closeModal() {
    this.cartForm.reset();
    this.closeModalEvent.emit();
  }

  calculateTotalPrice(): number {
    const formValues = this.cartForm.value;
    let totalPrice = this.product.price * formValues.quantity;

    // Calculate variations
    this.product.attributes.forEach((attribute, index) => {
      const selectedVariationId = this.variations.at(index)?.value;
      const selectedVariation = attribute.variations.find(v => v.id === selectedVariationId);
      if (selectedVariation) {
        totalPrice += selectedVariation.additionalPrice * formValues.quantity;
      }
    });

    // Calculate addons
    this.product.itemAddons.forEach((addon, index) => {
      if (this.addons.at(index).value) {
        totalPrice += addon.price * formValues.quantity;
      }
    });

    // Calculate extras
    this.addedExtras.forEach(extra => {
      totalPrice += extra.additionalPrice * formValues.quantity;
    });

    return totalPrice;
  }

  addExtra(extra: { name: string; additionalPrice: number }) {
    const index = this.product.itemExtras.findIndex(e => e.name === extra.name);
    if (index !== -1) {
      this.product.itemExtras.splice(index, 1);
    }

    this.addedExtras.push(extra);
  }

  isExtraAdded(extra: { name: string; additionalPrice: number }): boolean {
    return this.addedExtras.some(addedExtra => addedExtra.name === extra.name);
  }

  onSubmit() {
    console.log(this.cartForm)
    if (this.cartForm.invalid) {
      console.error('Form is invalid, please ensure all required fields are filled.');
      // this.snackbarService.showMessage('Please choose the variations', true)
      return;
    }

    const formValues = this.cartForm.value;

    const item = {
      itemId: this.product.id,
      itemName: this.product.name,
      quantity: formValues.quantity,
      ImgUrl: this.product.imageUrl,
      notes: formValues.specialInstructions || '',
      price: this.product.price,
      variations: this.product.attributes.map((attr, index) => ({
        name: attr.attributeName,
        additionalPrice: attr.variations.find(v => v.id === formValues['variation_' + index])?.additionalPrice || 0,
        attributeName: attr.attributeName,
      })),
      addons: this.product.itemAddons
        .map((addon, index) => ({
          name: addon.name,
          price: addon.price,
          selected: formValues['addon_' + index] || false
        }))
        .filter(addon => addon.selected),
      extras: this.addedExtras.map(extra => ({
        name: extra.name,
        additionalPrice: extra.additionalPrice
      }))
    };

    if (this.isEditMode) {
      // Update the existing cart item
      // this.cartService.updateCartItem(this.cartItem.cartItemId, item).subscribe(
      //   (response) => {
      //     if (response.success === false) {
      //       console.error('Error updating cart item:', response);
      //     } else {
      //       console.log('Cart item updated:', response);
      //       this.afterActionService.reloadCurrentRoute();
      //       this.closeModal();
      //     }
      //   },
      //   (error) => {
      //     console.error('Error updating cart item:', error);
      //   }
      // );
    } else {
      // Add a new item to the cart
      // this.cartService.addItemToCart(item).subscribe(
      //   (response) => {
      //     if (response.success === false) {
      //       if (response.message === 'Invalid token or customer not found') {
      //         localStorage.setItem('cartItem', JSON.stringify(item));
      //         console.log('Item saved to local storage due to invalid token or customer not found');
      //         this.closeModal();
      //       }
      //       console.error('Error adding item to cart:', response);
      //     } else {
      //       console.log('Item added to cart:', response);
      //       this.afterActionService.reloadCurrentRoute();
      //       this.closeModal();
      //     }
      //   },
      //   (error) => {
      //     console.error('Error adding item to cart:', error);
      //   }
      // );
    }
  }
}
