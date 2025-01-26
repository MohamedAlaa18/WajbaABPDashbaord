import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '@proxy/controllers';
import { ItemDto } from '@proxy/dtos/items-dtos';
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
  @Input() productItem!: ItemDto;
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
    this.cartForm = this.fb.group({
      quantity: [this.quantity, [Validators.required, Validators.min(1)]],
      specialInstructions: [''],
      variations: this.fb.array([]),
      addons: this.fb.array([]),
      extras: this.fb.array([])
    });

    // this.productItem.itemVariations.forEach(() => {
    //   (this.cartForm.get('variations') as FormArray).push(this.fb.control(null)); // or default value
    // });

    // this.productItem.itemAddons.forEach(() => {
    //   (this.cartForm.get('addons') as FormArray).push(this.fb.control(false)); // or default value
    // });
  }

  get variations(): FormArray {
    return this.cartForm.get('variations') as FormArray;
  }

  get addons() {
    return (this.cartForm.get('addons') as FormArray);
  }

  get extra(): FormArray {
    return this.cartForm.get('extras') as FormArray;
  }

  ngOnInit(): void {
    // Ensure the form setup happens only when productItem is available
    if (this.productItem) {
      this.initializeForm();
    }
  }

  ngOnChanges(): void {
    // Handle updates to productItem after initialization
    if (this.productItem) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    const variationsArray = this.fb.array([]);
    const addonsArray = this.fb.array([]);

    // Initialize variations and addons arrays
    if (this.productItem?.itemVariations) {
      this.productItem.itemVariations.forEach(() => {
        variationsArray.push(this.fb.control(null));
      });
    }

    if (this.productItem?.itemAddons) {
      this.productItem.itemAddons.forEach(() => {
        addonsArray.push(this.fb.control(false));
      });
    }

    // Update the form with initialized arrays
    this.cartForm.setControl('variations', variationsArray);
    this.cartForm.setControl('addons', addonsArray);
  }

  populateVariationsFormArray() {
    this.variations.clear(); // Clear existing controls
    if (this.productItem.itemVariations) {
      this.productItem.itemVariations.forEach(() => {
        this.variations.push(this.fb.control(null, Validators.required)); // Add a control for each variation
      });
    }
  }

  populateAddonsFormArray() {
    this.addons.clear(); // Clear existing controls
    if (this.productItem.itemAddons) {
      this.productItem.itemAddons.forEach(() => {
        this.addons.push(this.fb.control(false)); // Add a checkbox control for each addon
      });
    }
  }

  populateExtrasFormArray() {
    this.extra.clear(); // Clear existing controls
    if (this.productItem.itemExtras) {
      this.productItem.itemExtras.forEach(() => {
        this.extra.push(this.fb.control(false)); // Add a checkbox control for each extra
      });
    }
  }

  loadProductDetails(itemId: number) {
    this.itemService.getItemWithTransformedDetailsById(itemId).subscribe(
      (response) => {
        this.productItem = response.data;
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
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
    this.productItem.itemVariations.forEach((variation, index) => {
      if (variation) {
        totalPrice += variation.additionalPrice * formValues.quantity;
      }
    });

    // Calculate addons
    this.productItem.itemAddons.forEach((addon, index) => {
      const addonControl = this.addons.at(index);
      if (addonControl && addonControl.value) {
        totalPrice += addon.additionalPrice * formValues.quantity;
      }
    });

    // Calculate extras
    this.productItem.itemExtras.forEach((extra, index) => {
      const extraControl = this.extra.at(index);
      if (extraControl && extraControl.value) {
        totalPrice += extra.additionalPrice;
      }
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

  onSubmit() {
    console.log(this.cartForm)
    if (this.cartForm.invalid) {
      console.error('Form is invalid, please ensure all required fields are filled.');
      // this.snackbarService.showMessage('Please choose the variations', true)
      return;
    }

    const formValues = this.cartForm.value;

    const item = {
      itemId: this.productItem.id,
      itemName: this.productItem.name,
      quantity: formValues.quantity,
      ImgUrl: this.productItem.imageUrl,
      notes: formValues.specialInstructions || '',
      price: this.productItem.price,
      variations: this.productItem.itemVariations.map((variation, index) => ({
        name: variation.name,
        additionalPrice: variation.additionalPrice || 0,
      })),
      addons: this.productItem.itemAddons
        .map((addon, index) => ({
          name: addon.name,
          price: addon.additionalPrice,
          selected: formValues['addon_' + index] || false
        }))
        .filter(addon => addon.selected),
      extras: this.addedExtras.map(extra => ({
        name: extra.name,
        additionalPrice: extra.additionalPrice
      }))
    };

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
