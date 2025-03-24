import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { BranchService, CartService, OrderService, WajbaUserService } from '@proxy/controllers';
import { BranchDto, GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CreateOrderDto } from '@proxy/dtos/order-contract';
import { SnackbarService } from 'src/app/services/Snackbar/snackbar.service';

@Component({
  selector: 'app-pos-right-side',
  standalone: true,
  imports: [IconsComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pos-right-side.component.html',
  styleUrl: './pos-right-side.component.scss'
})
export class PosRightSideComponent implements OnInit {
  customers: WajbaUserDto[] = [];
  branches: BranchDto[] = [];
  user: WajbaUserDto;
  cart!: any;

  selectedTypeName: string | null = "POS";
  selectedTypeId: number | null = 5;
  searchQuery: string = '';
  form: FormGroup;
  selectedBranch: UpdateBranchDto;
  isSubmitting: boolean = false;

  orderType = [
    { name: 'POS', imageUrl: 'takeaway', id: 5 },
    { name: 'Delivery', imageUrl: 'delivery', id: 6 },
    { name: 'Drive thru', imageUrl: 'drive-thru', id: 2 },
    { name: 'Dine in', imageUrl: 'dine-in', id: 3 },
    { name: 'Pick up', imageUrl: 'takeaway', id: 4 },
  ];

  constructor(
    private fb: FormBuilder,
    private wajbaUserService: WajbaUserService,
    private orderService: OrderService,
    private cartService: CartService,
    private branchService: BranchService,
    private datePipe: DatePipe,
    private afterActionService: AfterActionService,
    private snackbarService: SnackbarService
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
      paymentMethod: [1],
      persons: [null],
      discountType: [0],
      discountValue: [0],
    });

    this.selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadBranches();
    this.loadCustomers();
    this.updateValidators();

    this.cart = { items: [], subTotal: 0, discountAmount: 0, serviceFee: 0, deliveryFee: 0, totalAmount: 0 };

    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      this.user = JSON.parse(storedUserData);
    }
    // const cartData = localStorage.getItem('cart');
    // if (cartData) {
    //   this.cart.items = JSON.parse(cartData);
    // } else {
    //   this.cart.items = [];
    // }
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response) => {
        console.log('Cart data from API:', response);

        // Update cart object
        this.cart.items = response.data?.items;
        this.cart.subTotal = response.data?.subTotal;
        this.cart.deliveryFee = response.data?.deliveryFee;
        this.cart.serviceFee = response.data?.serviceFee;
        this.cart.totalAmount = response.data?.totalAmount;
        this.cart.discountAmount = response.data?.discountAmount;

        // Save updated cart data to localStorage
        localStorage.setItem('cart', JSON.stringify(this.cart));

        console.log('Cart data updated in localStorage:', this.cart);
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
      }
    });
  }

  loadBranches() {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.branchService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.branches = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadCustomers(): void {
    const defaultInput: GetUserListDto = {
      type: 4, // Set the filtered type dynamically
      skipCount: 0,
      maxResultCount: undefined,
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
        buildingNameControl?.setValidators([Validators.required]);
        apartmentNumberControl?.setValidators([Validators.required]);
        floorControl?.setValidators([Validators.required]);
        streetControl?.setValidators([Validators.required]);
        phoneNumberControl?.setValidators([Validators.required]);
        break;

      case 'Drive thru':
        branchControl?.setValidators([Validators.required]);
        dateControl?.setValidators([Validators.required]);
        timeControl?.setValidators([Validators.required]);
        carColorControl?.setValidators([Validators.required]);
        carNumberControl?.setValidators([Validators.required]);
        carTypeControl?.setValidators([Validators.required]);
        break;

      case 'Dine in':
        personsControl?.setValidators([Validators.required]);
        timeControl?.setValidators([Validators.required]);
        dateControl?.setValidators([Validators.required]);
        branchControl?.setValidators([Validators.required]);
        break;

      case 'Pick up':
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

  selectService(type: any) {
    console.log(type)
    this.selectedTypeName = type.name;
    this.selectedTypeId = type.id;
    this.updateValidators();
  }

  incrementQuantity(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');

    if (!cart.items || !Array.isArray(cart.items)) {
      console.error('Cart items are missing or not an array', cart);
      return;
    }

    const itemIndex = cart.items.findIndex((item: any) => item.itemId === cartItemId);

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += 1;  // Increment quantity
      localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
      this.cart.items = cart.items; // Update UI cart
      this.calculateCartTotals(); // Recalculate totals
      console.log(`Quantity increased for item ID: ${cartItemId}`);
    }
  }

  decrementQuantity(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');

    if (!cart.items || !Array.isArray(cart.items)) {
      console.error('Cart items are missing or not an array', cart);
      return;
    }

    const itemIndex = cart.items.findIndex((item: any) => item.itemId === cartItemId);

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1; // Decrement quantity
        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart.items = cart.items; // Update UI cart
        this.calculateCartTotals();
        console.log(`Quantity decreased for item ID: ${cartItemId}`);
      } else {
        console.warn('Minimum quantity reached. Removing item.');
        this.onRemove(cartItemId);
      }
    }
  }

  onRemove(cartItemId: number) {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');

    if (!cart.items || !Array.isArray(cart.items)) {
      console.error('Cart items are missing or not an array', cart);
      return;
    }

    cart.items = cart.items.filter((item: any) => item.itemId !== cartItemId);

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cart.items = cart.items; // Update UI cart
    this.calculateCartTotals();
    console.log(`Item with ID: ${cartItemId} removed from cart`);
  }

  applyVoucherCode() {
    const discountValue = this.form.value.discountValue;
    if (!discountValue || discountValue <= 0) {
      console.error('Invalid discount value');
      return;
    }

    const discountType = Number(this.form.value.discountType); // 0 = Fixed, 1 = Percentage
    let discountAmount = 0;

    if (discountType === 0) {
      // Fixed discount
      discountAmount = discountValue;
    } else if (discountType === 1) {
      // Percentage discount
      discountAmount = (discountValue / 100) * this.cart.subTotal;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, this.cart.subTotal);

    // Update cart totals
    this.cart.discountAmount = discountAmount;
    this.cart.totalAmount = this.cart.subTotal - discountAmount + this.cart.serviceFee + this.cart.deliveryFee;

    console.log('Updated Cart:', this.cart);
  }

  calculateCartTotals() {
    const subTotal = this.cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const discountAmount = this.form.value.discountValue || 0;
    const serviceFee = this.cart.serviceFee; // Example fixed service fee
    const deliveryFee = this.cart.deliveryFee; // Example fixed delivery fee
    const totalAmount = subTotal - discountAmount + serviceFee + deliveryFee;

    this.cart.subTotal = subTotal;
    this.cart.discountAmount = discountAmount;
    this.cart.serviceFee = serviceFee;
    this.cart.deliveryFee = deliveryFee;
    this.cart.totalAmount = totalAmount;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { formattedDate, formattedTime, approximateTime } = this.getFormattedDateTime();

    // Construct order data
    const orderData: CreateOrderDto = {
      orderItemDto: this.cart.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price,
        instruction: item.instruction || '',
        selectedVariations: item.selectedVariations || [],
        selectedAddons: item.selectedAddons || [],
        selectedExtras: item.selectedExtras || []
      })),
      ordertype: this.selectedTypeId,
      branchId: this.selectedBranch.id,
      paymentMethod: this.form.value.paymentMethod,
      ...this.getOrderDetails(formattedDate, formattedTime, approximateTime)
    };

    const request$ = this.orderService.createOrderByOrderDtoAndEmployeeId(orderData, this.user.id);

    request$.subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.form.reset();
        this.clearCart();
        this.afterActionService.reloadCurrentRoute();
        this.snackbarService.showMessage('Your order has been added successfully');
      },
      error: (error) => {
        console.error('Error placing order:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  clearCart() {
    this.cartService.clearCartByCustomerId(this.user.id).subscribe({
      next: (response) => {
        console.log('Cart cleared successfully:', response)
      },
      error: (error) => {
        console.error('Error creating cart:', error);
      }
    });
  }
  private getOrderDetails(formattedDate: string, formattedTime: string, approximateTime: string) {
    return {
      // POS Order
      posOrder: this.selectedTypeName === 'POS' ? {
        phoneNumber: this.form.value.phoneNumber || '',
        tokenNumber: this.form.value.tokenNo || ''
      } : undefined,

      // POS Delivery Order
      posDeliveryOrder: this.selectedTypeName === 'Delivery' ? {
        buildingName: this.form.value.buildingName || '',
        apartmentNumber: this.form.value.apartmentNumber || '',
        floor: this.form.value.floor || '',
        street: this.form.value.street || '',
        phoneNumber: this.form.value.phoneNumber || '',
        additionalDirection: this.form.value.additionalDirections || '',
        addressLabel: this.form.value.addressLabel || 'Unknown'
      } : undefined,

      // Drive Thru Order
      driveThruOrder: this.selectedTypeName === 'Drive thru' ? {
        time: formattedTime,
        date: formattedDate,
        carColor: this.form.value.carColor || 'Unknown',
        carType: this.form.value.carType || 'Unknown',
        carNumber: this.form.value.carNumber || 'Unknown'
      } : undefined,

      // Dine In Order
      dineInOrder: this.selectedTypeName === 'Dine in' ? {
        time: formattedTime,
        numberOfPersons: this.form.value.persons || 1,
        date: formattedDate
      } : undefined,

      // Pick Up Order
      pickUpOrder: this.selectedTypeName === 'Pick up' ? {
        time: formattedTime,
        branchId: this.selectedBranch.id
      } : undefined,

      // Delivery Order
      deliveryOrder: this.selectedTypeName === 'Delivery' ? {
        title: this.form.value.addressLabel || 'Unknown',
        longitude: this.form.value.longitude || 0,
        latitude: this.form.value.latitude || 0,
        approximateTime
      } : undefined
    };
  }

  /** Helper to format date & time */
  private getFormattedDateTime() {
    const formDate = this.form.value.date ? new Date(this.form.value.date) : new Date();
    const formTime = this.form.value.time || '00:00';

    const formattedDate = this.datePipe.transform(formDate, 'yyyy-MM-dd') || '';
    const formattedTime = this.datePipe.transform(`${formattedDate}T${formTime}`, 'hh:mm a') || '';

    // Approximate time for delivery order
    const approximateTime = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSSZ') || '';

    return { formattedDate, formattedTime, approximateTime };
  }
}
