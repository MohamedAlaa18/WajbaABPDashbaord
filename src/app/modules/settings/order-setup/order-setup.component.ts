import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderSetupService } from '@proxy/controllers';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { TimeSlotsModalComponent } from 'src/app/shared/time-slots-modal/time-slots-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { UpdateOrderSetupDto } from '@proxy/dtos/order-setup-contract';

@Component({
  selector: 'app-order-setup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SettingsSidebarComponent],
  templateUrl: './order-setup.component.html',
  styleUrls: ['./order-setup.component.scss']
})
export class OrderSetupComponent implements OnInit {
  orderForm: FormGroup;
  isModalOpen = false;  // Track modal visibility
  modalTitle: string = '';  // Modal title (onTime, warning, delayTime)
  modalOpeningTime: string | null = null;  // Store opening time as string
  modalClosingTime: string | null = null;  // Store closing time as string
  currentField: string = '';  // To track which field is being edited

  constructor(
    private fb: FormBuilder,
    private orderSetupService: OrderSetupService,
    private modalService: NgbModal
  ) {
    this.orderForm = this.fb.group({
      foodPreparationTime: [null, [Validators.required]],
      scheduleOrderSlotDuration: [null, [Validators.required]],
      isTakeawayEnabled: [true, [Validators.required]],
      isDeliveryEnabled: [true, [Validators.required]],
      freeDeliveryKilometer: [null, [Validators.required]],
      basicDeliveryCharge: [null, [Validators.required]],
      chargePerKilo: [null, [Validators.required]],
      onTime: [null, [Validators.required]],
      warning: [null, [Validators.required]],
      delayTime: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadOrderSetup();
  }

  loadOrderSetup(): void {
    // const defaultInput: PagedAndSortedResultRequestDto = {
    //   sorting: '',
    //   skipCount: 0,
    //   maxResultCount: 10
    // };

    // Fetch the order setup data
    this.orderSetupService.getById().subscribe(
      (response) => {
        console.log("order Setup", response);

        this.orderForm.patchValue({
          foodPreparationTime: response.data.foodPreparationTime,
          scheduleOrderSlotDuration: response.data.scheduleOrderSlotDuration,
          isTakeawayEnabled: response.data.isTakeawayEnabled,
          isDeliveryEnabled: response.data.isDeliveryEnabled,
          freeDeliveryKilometer: response.data.freeDeliveryKilometer,
          basicDeliveryCharge: response.data.basicDeliveryCharge,
          chargePerKilo: response.data.chargePerKilo,
          onTime: response.data.ontime,
          warning: response.data.warning,
          delayTime: response.data.delayTime,
        });
      },
      (error) => {
        console.error('Error fetching order setup data', error);
      }
    );
  }

  openTimeModal(field: string): void {
    const modalRef = this.modalService.open(TimeSlotsModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    const currentFieldValue = this.orderForm.get(field)?.value || {};

    modalRef.componentInstance.openingTime = currentFieldValue.openingTime || null;
    modalRef.componentInstance.closingTime = currentFieldValue.closingTime || null;
    modalRef.componentInstance.weekDayId = this.getWeekDayId(field);

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.componentInstance.saveTimeSlot.subscribe((timeSlotData) => {
      this.onSaveTimeSlot(timeSlotData, field);
      modalRef.close();
    });
  }

  onSaveTimeSlot(timeSlotData: { openingTime: string; closingTime: string; weekDayId: number }, field: string): void {
    const timeSlotString = `${timeSlotData.openingTime} - ${timeSlotData.closingTime}`;
    this.orderForm.patchValue({
      [field]: timeSlotString // Update only the specific field
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTime(openingTime: string, closingTime: string): void {
    if (this.modalOpeningTime && this.modalClosingTime) {
      this.orderForm.patchValue({
        [this.currentField]: {
          openingTime,
          closingTime
        }
      });
    }
    this.closeModal();
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      let formValue = this.orderForm.value as UpdateOrderSetupDto;

      // Call the update method from the service
      this.orderSetupService.update(formValue).subscribe(response => {
        console.log('Order setup updated successfully', response);
      }, error => {
        console.error('Error updating order setup', error);
      });
    }
  }

  getWeekDayId(field: string): number {
    // Logic to determine the week day ID based on the field
    return 1; // Replace with actual logic
  }
}
