import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kitchen-card',
  standalone: true,
  imports: [CommonModule, IconsComponent, NgbDropdownModule],
  templateUrl: './kitchen-card.component.html',
  styleUrls: ['./kitchen-card.component.scss']
})
export class KitchenCardComponent implements OnInit, OnDestroy {
  @Input() order: any;
  @Input() isDone: boolean = false;
  status: string = 'Pending';
  buttonText: string = 'Start';
  formattedTime: string = '00:00';
  timeStatus: string = 'Pending';
  startTime: number = Date.now(); // Initialize start time when the component is created
  private intervalId: any; // To store the interval ID for cleanup

  ngOnInit(): void {
    console.log(this.order); // Log to see the order data structure
    this.startTimeTracking(); // Start tracking time when the component initializes
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startTimeTracking(): void {
    if (!this.isDone) {
      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.startTime) / 1000 / 60; // Convert milliseconds to minutes

        if (elapsedTime < 5) {
          this.timeStatus = 'Pending';
          this.formattedTime = this.formatTime(elapsedTime);
        } else if (elapsedTime >= 5 && elapsedTime < 8) {
          this.timeStatus = 'Cooking';
          this.formattedTime = this.formatTime(elapsedTime);
        } else if (elapsedTime >= 8) {
          this.timeStatus = 'Delivered';
          this.formattedTime = this.formatTime(elapsedTime);
          clearInterval(this.intervalId);
        }
      }, 1000);
    }
  }

  formatTime(elapsedTime: number): string {
    const minutes = Math.floor(elapsedTime);
    const seconds = Math.floor((elapsedTime - minutes) * 60);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  get statusClassHeader() {
    return {
      'bg-pending': this.timeStatus === 'Pending',
      'bg-cooking': this.timeStatus === 'Cooking',
      'bg-delivered': this.timeStatus === 'Delivered',
      'bg-done': this.isDone,
    };
  }

  get statusClassBg() {
    return {
      'bg-pending-btn': this.status === 'Pending',
      'bg-cooking-btn': this.status === 'Cooking',
      'bg-delivered-btn': this.status === 'Delivered' || this.isDone,
    };
  }

  get buttonClass() {
    return {
      'btn-primary': this.status === 'Pending',
      'btn-success': this.status === 'Cooking',
      'btn-dark': this.status === 'Delivered',
    };
  }

  get orderTypeClass() {
    return {
      'bg-dine-in': this.order.orderType === 'Dine In',
      'bg-delivery': this.order.orderType === 'Delivery',
      'bg-drive-thru': this.order.orderType === 'Drive Thru',
    };
  }

  get borderClass() {
    return {
      'border-success': this.status === 'Cooking',
      'border-dark': this.status === 'Delivered',
    };
  }

  orderImage(): string {
    if (this.order.orderType === 'Delivery') {
      return 'delivery';
    } else if (this.order.orderType === 'Dine In') {
      return 'dine-in';
    } else if (this.order.orderType === 'Drive Thru') {
      return 'drive-thru';
    } else if (this.order.orderType === 'Takeaway') {
      return 'takeaway';
    }
    return 'default';
  }

  nextStatus() {
    if (this.status === 'Pending') {
      this.status = 'Cooking';
      this.buttonText = 'Ready';
    } else if (this.status === 'Cooking') {
      this.status = 'Delivered';
      this.buttonText = 'Delivered';
    }
  }

  toggleItemCompletion(item: any) {
    item.completed = !item.completed;
  }

  undoStatus() {
    if (this.status === 'Cooking') {
      this.status = 'Pending';
      this.buttonText = 'Start';
    } else if (this.status === 'Delivered') {
      this.status = 'Cooking';
      this.buttonText = 'Ready';
    }
  }
}
