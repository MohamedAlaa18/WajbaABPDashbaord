import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { CategoryService, ItemService, WajbaUserService } from '@proxy/controllers';
import { UpdateCategory } from '@proxy/dtos/categories';
import { GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [IconsComponent, CommonModule, FormsModule, ReactiveFormsModule, ProductCardComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class POSComponent implements OnInit {
  categories: UpdateCategory[] = [];
  items: ItemDto[] = [];
  customers: WajbaUserDto[] = [];
  cart!: any;

  discountType: number = 0;
  discountValue: number | null = null;
  selectedCategoryId: number | undefined = undefined;
  selectedTypeName: string | null = "POS";
  selectedTypeId: number | null = 5;
  searchQuery: string = '';
  // isSidebarOpen = false;
  form: FormGroup;
  selectedBranch: UpdateBranchDto;
  itemsPerPage = 5;
  selectedPageIndex = 0;
  pageCount = 3;
  middleIndex: number = Math.floor(this.pageCount / 2);
  maxIndex: number = this.pageCount - 1;

  orderType = [
    { name: 'POS', imageUrl: 'takeaway', id: 5 },
    { name: 'Delivery', imageUrl: 'delivery', id: 6 },
    { name: 'Drive thru', imageUrl: 'drive-thru', id: 2 },
    { name: 'Dine in', imageUrl: 'dine-in', id: 3 },
    { name: 'Pick up', imageUrl: 'takeaway', id: 4 },
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private wajbaUserService: WajbaUserService,
    // private cartService: CartService,
    // private orderService: OrderService,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      customer: [null],
      phoneNumber: [''],
      tokenNo: [''],
      buildingName: [''],
      apartmentNumber: [''],
      floor: [''],
      street: [''],
      additionalDirections: [''],
      addressLabel: [''],
      time: [''],
      date: [''],
      branch: [''],
      carType: [''],
      carColor: [''],
      carNumber: [''],
      paymentMethod: [''],
      persons: [null],
    });

    this.selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
  }

  ngOnInit(): void {
    this.loadCategory();
    this.loadItems();
    this.loadCart();
    this.loadCustomers();
    this.updateValidators();

    this.cart = { items: [], subTotal: 50, discountAmount: 10, serviceFee: 10, deliveryFee: 10, totalAmount: 60 };
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart.items = JSON.parse(cartData);
    } else {
      this.cart.items = [];
    }
  }

  loadItems(): void {
    this.itemService.getItemsByCategoryByCategoryIdAndName(this.selectedCategoryId, this.searchQuery).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  loadCategory(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.categoryService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.categories = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadCart() {
    // this.cartService.getCart().subscribe(
    //   (response) => {
    //     this.cart = response.data;
    //     console.log(response)
    //   },
    //   (error) => {
    //     console.error('Error fetching customers', error);
    //   }
    // );
  }

  loadCustomers(): void {
    const defaultInput: GetUserListDto = {
      type: 4, // Set the filtered type dynamically
      skipCount: 0,
      maxResultCount: 10,
    };

    this.wajbaUserService.getWajbaUserByInput(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.customers = response.items;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  updateValidators() {
    const customerControl = this.form.get('customer');
    const phoneNumberControl = this.form.get('phoneNumber');
    const tokenNoControl = this.form.get('tokenNo');
    const buildingNameControl = this.form.get('buildingName');
    const apartmentNumberControl = this.form.get('apartmentNumber');
    const floorControl = this.form.get('floor');
    const streetControl = this.form.get('street');
    const branchControl = this.form.get('branch');
    const carTypeControl = this.form.get('carType');
    const carColorControl = this.form.get('carColor');
    const carNumberControl = this.form.get('carNumber');
    const personsControl = this.form.get('persons');
    const dateControl = this.form.get('date');
    const timeControl = this.form.get('time');


    // Reset all validators first
    customerControl?.clearValidators();
    phoneNumberControl?.clearValidators();
    tokenNoControl?.clearValidators();
    buildingNameControl?.clearValidators();
    apartmentNumberControl?.clearValidators();
    floorControl?.clearValidators();
    streetControl?.clearValidators();
    branchControl?.clearValidators();
    carTypeControl?.clearValidators();
    carColorControl?.clearValidators();
    carNumberControl?.clearValidators();
    personsControl?.clearValidators();
    dateControl?.clearValidators();
    timeControl?.clearValidators();

    // Add validators based on selected type
    switch (this.selectedTypeName) {
      case 'POS':
        customerControl?.setValidators([Validators.required]);
        phoneNumberControl?.setValidators([Validators.required]);
        tokenNoControl?.setValidators([Validators.required]);
        break;

      case 'Delivery':
        tokenNoControl?.setValidators([Validators.required]);
        buildingNameControl?.setValidators([Validators.required]);
        apartmentNumberControl?.setValidators([Validators.required]);
        floorControl?.setValidators([Validators.required]);
        streetControl?.setValidators([Validators.required]);
        phoneNumberControl?.setValidators([Validators.required]);
        break;

      case 'Drive thru':
        tokenNoControl?.setValidators([Validators.required]);
        branchControl?.setValidators([Validators.required]);
        dateControl?.setValidators([Validators.required]);
        timeControl?.setValidators([Validators.required]);
        carColorControl?.setValidators([Validators.required]);
        carNumberControl?.setValidators([Validators.required]);
        carTypeControl?.setValidators([Validators.required]);
        break;

      case 'Dine in':
        tokenNoControl?.setValidators([Validators.required]);
        personsControl?.setValidators([Validators.required]);
        timeControl?.setValidators([Validators.required]);
        dateControl?.setValidators([Validators.required]);
        branchControl?.setValidators([Validators.required]);
        break;

      case 'Pick up':
        tokenNoControl?.setValidators([Validators.required]);
        timeControl?.setValidators([Validators.required]);
        branchControl?.setValidators([Validators.required]);
        break;
    }

    // Update the form controls to ensure the validators are applied
    customerControl?.updateValueAndValidity();
    phoneNumberControl?.updateValueAndValidity();
    tokenNoControl?.updateValueAndValidity();
    buildingNameControl?.updateValueAndValidity();
    apartmentNumberControl?.updateValueAndValidity();
    floorControl?.updateValueAndValidity();
    streetControl?.updateValueAndValidity();
    branchControl?.updateValueAndValidity();
    carTypeControl?.updateValueAndValidity();
    carColorControl?.updateValueAndValidity();
    carNumberControl?.updateValueAndValidity();
    dateControl?.updateValueAndValidity();
    timeControl?.updateValueAndValidity();
    personsControl?.updateValueAndValidity();
  }

  selectCategory(categoryId: number) {
    categoryId === 0 ?
      this.selectedCategoryId = undefined :
      this.selectedCategoryId = categoryId;
    this.loadItems();
  }

  selectService(type: any) {
    console.log(type)
    this.selectedTypeName = type.name;
    this.selectedTypeId = type.id;
    this.updateValidators();
  }

  // Handle scroll to update selected page index based on position
  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    const scrollContainer = document.querySelector('.categories-container');
    const categories = Array.from(document.querySelectorAll('.category-button'));

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerLeft = containerRect.left;

      // Define zones within the container
      const leftThird = containerLeft + containerWidth * 0.33;
      const rightThird = containerLeft + containerWidth * 0.66;

      let closestCategoryIndex = 0;
      let minDistance = Infinity;

      categories.forEach((category, index) => {
        const categoryRect = category.getBoundingClientRect();
        const categoryCenterX = categoryRect.left + categoryRect.width / 2;

        // Determine which zone the category is in
        let zonePosition;
        if (categoryCenterX < leftThird) {
          zonePosition = 'left';
        } else if (categoryCenterX > rightThird) {
          zonePosition = 'right';
        } else {
          zonePosition = 'center';
        }

        // Calculate distance from the container's center
        const distanceFromCenter = Math.abs(categoryCenterX - (containerLeft + containerWidth / 2));

        // Update closest category if this one is closer to the center
        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          closestCategoryIndex = index;
        }
      });

      // Update selected page index
      this.selectedPageIndex = Math.max(0, closestCategoryIndex - 1)
      // console.log(this.selectedPageIndex);
    }
  }

  selectPage(index: number): void {
    this.selectedPageIndex = index;
    this.scrollToPage(index);
  }

  scrollToPage(index: number): void {
    // Get the container element
    const container = document.querySelector('.categories-container') as HTMLElement;

    // Get the first category card position
    const firstCategory = container.querySelector('.category-button') as HTMLElement;

    if (firstCategory) {
      // Calculate the width of each category card including gap
      const categoryWidth = firstCategory.offsetWidth + parseFloat(getComputedStyle(firstCategory).marginRight || '0');

      // Calculate the scroll position based on the first category card and the index
      const scrollPosition = categoryWidth * index;

      // Scroll smoothly to the calculated position
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }

  searchAction(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.loadItems();
  }

  incrementQuantity(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex((item: any) => item.id === cartItemId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;  // Increment quantity
      localStorage.setItem('cart', JSON.stringify(cart));
      this.cart.items = cart; // Update the cart in the component
      this.calculateCartTotals(); // Recalculate cart totals
      console.log(`Quantity increased for item ID: ${cartItemId}`);
    }
  }

  decrementQuantity(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex((item: any) => item.id === cartItemId);

    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1; // Decrement quantity
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart.items = cart; // Update the cart in the component
        this.calculateCartTotals(); // Recalculate cart totals
        console.log(`Quantity decreased for item ID: ${cartItemId}`);
      } else {
        console.warn('Minimum quantity reached. Use remove instead.');
        this.onRemove(cartItemId);
      }
    }
  }

  onRemove(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter((item: any) => item.id !== cartItemId);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.cart.items = updatedCart; // Update the cart in the component
    this.calculateCartTotals(); // Recalculate cart totals
    console.log(`Item with ID: ${cartItemId} removed from cart`);
  }

  calculateCartTotals() {
    const subTotal = this.cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const discountAmount = this.discountValue || 0;
    const serviceFee = 10; // Example fixed service fee
    const deliveryFee = 10; // Example fixed delivery fee
    const totalAmount = subTotal - discountAmount + serviceFee + deliveryFee;

    this.cart.subTotal = subTotal;
    this.cart.discountAmount = discountAmount;
    this.cart.serviceFee = serviceFee;
    this.cart.deliveryFee = deliveryFee;
    this.cart.totalAmount = totalAmount;
  }

  applyVoucherCode(discountType: number, discountValue: number | null) {
  }

  trackByKey(index: number, item: any) {
    return item?.id;
  }

  // Updated placeOrder function in your component
  onSubmit() {
    if (this.form.valid) {
      const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

      // Set default date and time if they are missing
      const formDate = this.form.value.date ? new Date(this.form.value.date) : new Date();
      const formTime = this.form.value.time || '00:00';

      // Combine date and time into a single Date object
      const combinedDateTime = new Date(`${formDate.toISOString().split('T')[0]}T${formTime}`);

      if (isNaN(combinedDateTime.getTime())) {
        console.error("Invalid date or time provided.");
        // this.snackbarService.showMessage('Invalid date or time, please provide a valid input');
        return;
      }

      // Format date and time for orderData
      const formattedDate = this.datePipe.transform(combinedDateTime, 'MM-dd-yyyy') || '';
      const formattedTime = this.datePipe.transform(combinedDateTime, 'hh:mm a') || '';

      const orderData: any = {
        status: 1,
        ordertype: this.selectedTypeId,
        paymentMethod: 1,
        branchId: selectedBranch.id,
      };

      switch (this.selectedTypeName) {
        case 'POS':
          orderData.posOrder = {
            phoneNumber: this.form.value.phoneNumber,
            tokenNumber: this.form.value.tokenNo,
          };
          break;

        case 'Delivery':
          orderData.posDeliveryOrder = {
            buildingName: this.form.value.buildingName,
            apartmentNumber: this.form.value.apartmentNumber,
            floor: this.form.value.floor,
            street: this.form.value.street,
            phoneNumber: this.form.value.phoneNumber,
            additionalDirection: this.form.value.additionalDirections,
            addressLabel: this.form.value.addressLabel,
          };
          break;

        case 'Drive thru':
          orderData.driveThruOrder = {
            time: formattedTime,
            date: formattedDate,
            carColor: this.form.value.carColor || 'unknown',
            carType: this.form.value.carType || 'unknown',
            carNumber: this.form.value.carNumber || 'unknown',
          };
          break;

        case 'Dine in':
          orderData.dineInOrder = {
            time: formattedTime,
            date: formattedDate,
            numberOfPersons: this.form.value.persons || 1,
          };
          break;

        case 'Pick up':
          orderData.pickUpOrder = {
            time: formattedTime,
          };
          break;

        default:
          console.error('Unknown order type');
          return;
      }

      console.log('Order Data:', orderData);

      // this.orderService.placeOrder(orderData).subscribe({
      //   next: (response) => {
      //     if (response.success === false) {
      //       console.error('Error placing order:', response);
      //     } else {
      //       console.log('Order placed successfully:', response);
      //       this.form.reset();
      //       this.loadCart();
      //       this.afterActionService.reloadCurrentRoute();
      //       this.clear();
      //       this.snackbarService.showMessage('Your order has been added successfully');
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Error placing order:', error);
      //   }
      // });
    } else {
      console.log('Form is invalid:', this.form);
      this.form.markAllAsTouched();
    }
  }
}
