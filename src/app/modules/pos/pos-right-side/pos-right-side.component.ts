import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { BranchService, CartService, WajbaUserService } from '@proxy/controllers';
import { BranchDto, GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
// import { PosOrderService } from '@proxy/fos-api/controllers';
// import { OrderDTO } from '@proxy/dtos/order-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CookieService } from 'ngx-cookie-service';
import { PosOrderService } from '@proxy/fos-api/controllers';


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
  cart!: any;

  discountType: number = 0;
  discountValue: number | null = null;
  selectedTypeName: string | null = "POS";
  selectedTypeId: number | null = 5;
  searchQuery: string = '';
  form: FormGroup;
  selectedBranch: UpdateBranchDto;

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
    private posOrderService: PosOrderService,
    private cartService: CartService,
    private branchService: BranchService,
    private datePipe: DatePipe,
    private afterActionService: AfterActionService,
    private cookieService: CookieService
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
    this.loadCart();
    this.loadBranches();
    this.loadCustomers();
    this.updateValidators();

    this.cart = { items: [], subTotal: 50, discountAmount: 10, serviceFee: 10, deliveryFee: 10, totalAmount: 60 };
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
        console.log(response)
        this.cart.items = response.data.items;
        this.cart.subTotal = response.data.subTotal;
        this.cart.deliveryFee = response.data.deliveryFee;
        this.cart.serviceFee = response.data.serviceFee;
        this.cart.totalAmount = response.data.totalAmount;
        this.cart.discountAmount = response.data.discountAmount;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
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

  onSubmit() {
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form);
      this.form.markAllAsTouched();
      return;
    }

    const { formattedDate, formattedTime, approximateTime } = this.getFormattedDateTime();

    const orderData: any = {
      orderDto: {  // Wrap the order data in the "orderDto" field
        status: 0,
        ordertype: this.selectedTypeId,
        paymentMethod: 0,
        branchId: 1,
        pickUpOrder: { time: formattedTime },
        deliveryOrder: {
          title: '',
          longitude: 0,
          latitude: 0,
          approximateTime: approximateTime  // Ensure this is in the correct format
        },
        driveThruOrder: {
          time: formattedTime,
          date: formattedDate,
          carColor: '',
          carType: '',
          carNumber: ''
        },
        dineInOrder: {
          time: formattedTime,
          numberOfPersons: 0,
          date: formattedDate
        },
        posOrder: {
          phoneNumber: '',
          tokenNumber: ''
        },
        posDeliveryOrder: {
          buildingName: '',
          apartmentNumber: '',
          floor: '',
          street: '',
          phoneNumber: '',
          additionalDirection: '',
          addressLabel: ''
        },
        ...this.getOrderDetails(formattedDate, formattedTime, approximateTime)
      }
    };

    console.log('Order Data:', orderData);

    this.posOrderService.addOrderByOrderDto(orderData).subscribe({
      next: (response) => {
        if (!response.success) {
          console.error('Error placing order:', response);
        } else {
          console.log('Order placed successfully:', response);
          this.handleOrderSuccess();
        }
      },
      error: (error) => {
        console.error('Error placing order:', error);
      }
    });
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

  /** Helper to get order details based on type */
  private getOrderDetails(formattedDate: string, formattedTime: string, approximateTime: string) {
    const details = {
      pickUpOrder: { time: formattedTime },
      deliveryOrder: {
        title: this.form.value.addressLabel || 'Unknown',
        longitude: this.form.value.longitude || 0,
        latitude: this.form.value.latitude || 0,
        approximateTime
      },
      driveThruOrder: {
        time: formattedTime,
        date: formattedDate,
        carColor: this.form.value.carColor || 'Unknown',
        carType: this.form.value.carType || 'Unknown',
        carNumber: this.form.value.carNumber || 'Unknown',
      },
      dineInOrder: {
        time: formattedTime,
        numberOfPersons: this.form.value.persons || 1,
        date: formattedDate,
      },
      posOrder: {
        phoneNumber: this.form.value.phoneNumber || '',
        tokenNumber: this.form.value.tokenNo || '',
      },
      posDeliveryOrder: {
        buildingName: this.form.value.buildingName || '',
        apartmentNumber: this.form.value.apartmentNumber || '',
        floor: this.form.value.floor || '',
        street: this.form.value.street || '',
        phoneNumber: this.form.value.phoneNumber || '',
        additionalDirection: this.form.value.additionalDirections || '',
        addressLabel: this.form.value.addressLabel || '',
      }
    };

    // Ensure the fields are only populated for the selected order type
    if (this.selectedTypeName === 'Pick up') {
      return { pickUpOrder: details.pickUpOrder };
    }
    if (this.selectedTypeName === 'Delivery') {
      return { deliveryOrder: details.posDeliveryOrder };
    }
    if (this.selectedTypeName === 'Drive thru') {
      return { driveThruOrder: details.driveThruOrder };
    }
    if (this.selectedTypeName === 'Dine in') {
      return { dineInOrder: details.dineInOrder };
    }
    if (this.selectedTypeName === 'POS') {
      return { posOrder: details.posOrder };
    }
    // if (this.selectedTypeName === 'Pick up') {
    //   return { posDeliveryOrder: details.posDeliveryOrder };
    // }
    return {};
  }

  /** Handles order success - resets form & reloads UI */
  private handleOrderSuccess() {
    this.form.reset();
    // this.loadCart();
    this.afterActionService.reloadCurrentRoute();
  }
}
