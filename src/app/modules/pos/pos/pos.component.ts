import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { BranchService, CategoryService } from '@proxy/controllers';
import { AddToCartModalComponent } from 'src/app/shared/add-to-cart-modal/add-to-cart-modal.component';
import { UpdateCategory } from '@proxy/dtos/categories';
import { UpdateBranchDto } from '@proxy/dtos/branch-contract';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [IconsComponent, CommonModule, AddToCartModalComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class POSComponent implements OnInit, AfterViewInit {
  // customers!: ICustomer[];
  categories!: UpdateCategory[];
  // products!: IProductItem[];
  // cart!: ICart;
  branches!: UpdateBranchDto[];

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
  pageCount = 5;

  orderType = [
    { name: 'POS', imageUrl: 'takeaway', id: 5 },
    { name: 'Delivery', imageUrl: 'delivery', id: 6 },
    { name: 'Drive thru', imageUrl: 'drive-thru', id: 2 },
    { name: 'Dine in', imageUrl: 'dine-in', id: 3 },
    { name: 'Pick up', imageUrl: 'takeaway', id: 4 },
  ];

  constructor(
    private fb: FormBuilder,
    // private sidebarService: SidebarService,
    private categoryService: CategoryService,
    // private customerService: CustomerService,
    // private itemsService: ItemsService,
    // private cartService: CartService,
    // private orderService: OrderService,
    private branchService: BranchService,
    private afterActionService: AfterActionService,
    // private snackbarService: SnackbarService,
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
      persons: [null],
    });

    this.selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
  }

  ngOnInit(): void {
    // Fetching sidebar state
    // this.sidebarService.getSidebarState().subscribe(isOpen => {
    //   this.isSidebarOpen = isOpen;
    // });

    // Fetch categories from CategoryService
    // this.categoryService.getAllCategories().subscribe(
    //   (response) => {
    //     this.categories = response.data;
    //     this.pageCount = Math.ceil(this.categories.length / 5);
    //     console.log(this.pageCount)
    //   },
    //   (error) => {
    //     console.error('Error fetching categories', error);
    //   }
    // );

    // Fetch customers from CustomerService
    // this.customerService.getAllCustomers().subscribe(
    //   (response) => {
    //     this.customers = response.data;
    //   },
    //   (error) => {
    //     console.error('Error fetching customers', error);
    //   }
    // );

    this.loadItems();
    this.loadCart();
    this.loadBranches();
    this.updateValidators();
  }

  ngAfterViewInit(): void {
    // this.toggleSidebar();
  }

  loadItems() {
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    // this.itemsService.getItems(this.selectedCategoryId, storedBranch.id, this.searchQuery).subscribe(
    //   (response) => {
    //     this.products = response.data;
    //   },
    //   (error) => {
    //     console.error('Error fetching customers', error);
    //   }
    // );
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

  loadBranches() {
    // this.branchService.getList().subscribe(
    //   (response) => {
    //     this.branches = response.data;
    //     console.log(response)
    //   },
    //   (error) => {
    //     console.error('Error fetching customers', error);
    //   }
    // );
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

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data', this.form.value);
    }
  }

  calculateWidth(itemCount: number): number {
    const itemWidth = 113.12; // width of each item
    const gapWidth = 12;      // gap between items
    const totalWidth = itemCount * itemWidth + (itemCount - 1) * gapWidth;
    return totalWidth; // Correctly format the return value
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

  // toggleSidebar(): void {
  //   if (this.isSidebarOpen) {
  //     this.sidebarService.toggleSidebar();
  //   }
  // }

  selectPage(index: number): void {
    this.selectedPageIndex = index;
    this.scrollToPage(index);
  }

  // Scroll to the selected page
  scrollToPage(index: number): void {
    const container = document.querySelector('.categories-container') as HTMLElement;
    const scrollPosition = index * this.calculateWidth(5);
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }

  // Listen for scroll events to update the active button
  onScroll(event: Event): void {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const pageWidth = this.calculateWidth(3);
    this.selectedPageIndex = Math.round(scrollLeft / pageWidth);
  }

  searchAction(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.loadItems();
  }

  onRemove(cartItemId: number) {
    // this.cartService.deleteCartItemById(cartItemId).subscribe({
    //   next: () => {
    //     console.log(`Item with ID ${cartItemId} removed successfully`);
    //     this.loadCart();
    //     this.afterActionService.reloadCurrentRoute();
    //   },
    //   error: () => {
    //     console.error('Failed to remove item from cart');
    //   }
    // });
  }

  incrementQuantity(cartItem: any) { // ICart type
    // const newQuantity = cartItem.quantity + 1;
    // this.cartService.updateCartItemQuantity(cartItem.cartItemId, newQuantity).subscribe({
    //   next: () => {
    //     console.log(`Quantity for item ${cartItem.cartItemId} increased to ${newQuantity}`);
    //     this.loadCart();
    //     this.afterActionService.reloadCurrentRoute();
    //   },
    //   error: (err) => {
    //     console.error('Error incrementing item quantity:', err);
    //   }
    // });
  }

  decrementQuantity(cartItem: any) {// ICart type
    // if (cartItem.quantity > 1) {
    //   const newQuantity = cartItem.quantity - 1;
    //   this.cartService.updateCartItemQuantity(cartItem.cartItemId, newQuantity).subscribe({
    //     next: () => {
    //       console.log(`Quantity for item ${cartItem.cartItemId} decreased to ${newQuantity}`);
    //       this.loadCart();
    //       this.afterActionService.reloadCurrentRoute();
    //     },
    //     error: (err) => {
    //       console.error('Error decrementing item quantity:', err);
    //     }
    //   });
    // } else {
    //   console.warn(`Cannot decrement quantity for item ${cartItem.cartItemId} below 1`);
    // }
  }

  clear() {
    // this.cartService.clearCart().subscribe(
    //   response => {
    //     console.log('Cart cleared successfully:', response);
    //     this.loadCart();
    //   },
    //   error => {
    //     console.error('Error clearing cart:', error);
    //   }
    // );
  }

  // Updated placeOrder function in your component
  placeOrder(): void {
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

  applyVoucherCode(discountType: number, discountValue: number | null) {
    // if (discountValue)
    //   this.cartService.applyVoucherCode(discountType, discountValue).subscribe({
    //     next: (response) => {
    //       console.log("Voucher applied successfully:", response);
    //       this.loadCart();
    //       this.afterActionService.reloadCurrentRoute();
    //     },
    //     error: (error) => {
    //       console.error("Error applying voucher code:", error);
    //     }
    //   });
  }
}
