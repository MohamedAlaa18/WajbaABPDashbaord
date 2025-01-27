import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '@proxy/controllers';
import { ItemTransformedDto } from '@proxy/dtos/items-dtos';
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
  @Input() productItem!: ItemTransformedDto;
  @Output() close = new EventEmitter<void>();

  quantity: number = 1;
  specialInstructions: string = '';
  cartForm!: FormGroup;

  addedExtras: { name: string; additionalPrice: number }[] = [];

  constructor(
    private itemService: ItemService,
    // private cartService: CartService,
    private fb: FormBuilder,
    // private snackbarService: SnackbarService,
    private afterActionService: AfterActionService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadItemDetails(this.productItem.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['isModalOpen'] && this.isModalOpen) {
    //   if (this.isEditMode) {
    //     this.loadItemDetails(this.productItem.id);
    //     // this.quantity = this.productItem.quantity;
    //   } else {
    //     this.loadItemDetails(this.productItem.id);
    //   }
    //   this.resetExtras();
    // }
  }

  resetExtras() {
    this.addedExtras = [];
  }

  createForm() {
    this.cartForm = this.fb.group({
      quantity: [this.quantity],
      specialInstructions: [''],
      variations: this.fb.array([],),
      addons: this.fb.array([]),
      extras: this.fb.array([])
    });
  }

  loadItemDetails(itemId: number) {
    this.itemService.getItemWithTransformedDetailsById(itemId).subscribe(
      (response) => {
        console.log(response)
        this.productItem = response.data;
        this.populateForm();
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
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
    this.productItem.attributes.forEach((attribute) => {
      const control = this.fb.control(null, Validators.required);
      this.variations.push(control);
    });

    // Populate addons
    this.productItem.itemAddons.forEach(() => {
      const control = this.fb.control(false);
      this.addons.push(control);
    });

    // Populate extras
    this.productItem.itemExtras.forEach(() => {
      const control = this.fb.control(false);
      this.extra.push(control);
    });

    // if (this.isEditMode) {
    //   this.cartForm.patchValue({
    //     specialInstructions: this.cartItem.notes,
    //     quantity: this.cartItem.quantity,
    //   });

    //   this.addedExtras = this.cartItem.extras || [];
    // }
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
    this.close.emit();
  }

  calculateTotalPrice(): number {
    const formValues = this.cartForm.value;
    let totalPrice = this.productItem.price * formValues.quantity;

    // Calculate variations
    this.productItem.attributes?.forEach((attribute, index) => {
      const selectedVariationId = this.variations.at(index)?.value;
      const selectedVariation = attribute.variations.find(v => v.id === selectedVariationId);
      if (selectedVariation) {
        totalPrice += selectedVariation.additionalPrice * formValues.quantity;
      }
    });

    // Calculate addons
    this.productItem.itemAddons.forEach((addon, index) => {
      if (this.addons.at(index)?.value) {
        totalPrice += addon.additionalPrice * formValues.quantity;
      }
    });

    // Calculate extras
    this.addedExtras.forEach(extra => {
      totalPrice += extra.additionalPrice * formValues.quantity;
    });

    return totalPrice;
  }

  addExtra(extra: { name: string; additionalPrice: number }) {
    const index = this.productItem.itemExtras.findIndex(e => e.name === extra.name);
    if (index !== -1) {
      this.productItem.itemExtras.splice(index, 1);
    }

    this.addedExtras.push(extra);
  }

  isExtraAdded(extra: { name: string; additionalPrice: number }): boolean {
    return this.addedExtras.some(addedExtra => addedExtra.name === extra.name);
  }

  onSubmit() {
    console.log(this.cartForm);

    if (this.cartForm.invalid) {
      console.error('Form is invalid, please ensure all required fields are filled.', this.cartForm);
      this.cartForm.markAllAsTouched();
      return;
    }

    const formValues = this.cartForm.value;

    const item = {
      id: this.productItem.id,
      itemName: this.productItem.name,
      quantity: formValues.quantity,
      ImgUrl: this.productItem.imageUrl,
      notes: formValues.specialInstructions || '',
      price: this.productItem.price,
      variations: this.variations.value.map((value, index) => ({
        name: this.productItem.attributes[index].attributeName,
        additionalPrice: this.productItem.attributes[index].variations.find(v => v.id === value)?.additionalPrice || 0,
        attributeName: this.productItem.attributes[index].attributeName,
      })),
      addons: this.addons.value
        .map((selected, index) => selected && {
          name: this.productItem.itemAddons[index].name,
          additionalPrice: this.productItem.itemAddons[index].additionalPrice,
        })
        .filter(Boolean),
      extras: this.addedExtras.map(extra => ({
        name: extra.name,
        additionalPrice: extra.additionalPrice,
      })),
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (this.isEditMode) {
      // Update the item in localStorage
      const updatedCart = existingCart.map(cartItem =>
        cartItem.itemId === item.id ? { ...cartItem, ...item } : cartItem
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('Cart item updated in local storage:', item);
      this.afterActionService.reloadCurrentRoute();
    } else {
      // Add the new item to localStorage
      existingCart.push(item);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      console.log('Item added to cart in local storage:', item);
      this.afterActionService.reloadCurrentRoute();
    }

    // Close the modal or take necessary post-action
    this.closeModal();
  }
}
