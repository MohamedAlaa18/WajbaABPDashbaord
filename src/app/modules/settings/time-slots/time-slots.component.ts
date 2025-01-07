import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeSlotsModalComponent } from "../../../shared/time-slots-modal/time-slots-modal.component";
import { TimeSlotService } from '@proxy/controllers';
import { TimeSlotUpdateDetailDto, UpdateTimeSlotDto } from '@proxy/dtos/time-slots-contract';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IconsComponent,
    SettingsSidebarComponent,
  ],
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss']
})
export class TimeSlotsComponent implements OnInit {
  isModalOpen: boolean = false;
  weekDayTimeSlots: { weekDay: number; timeSlots: TimeSlotUpdateDetailDto[] }[] = [];
  weekDayIdForModal!: number;

  constructor(
    private modalService: NgbModal,
    private timeSlotService: TimeSlotService,
  ) { }

  ngOnInit(): void {
    this.loadTimeSlots();
  }

  // Load time slots from the server
  loadTimeSlots(): void {
    this.timeSlotService.getAll().subscribe((response: any) => {
      if (response.success) {
        console.log(response);
        this.weekDayTimeSlots = response.data.map((day: any) => ({
          weekDay: day.weekDay,
          timeSlots: day.timeSlots.map((slot: any) => ({
            id: slot.id,
            openingTime: slot.openingTime,
            closingTime: slot.closingTime,
          })),
        }));
      }
    });
  }

  // Save updated time slots to the server
  onSave(): void {
    const updateTimeSlotDtos: UpdateTimeSlotDto[] = this.weekDayTimeSlots.map(day => ({
      weekDay: day.weekDay,
      timeSlots: day.timeSlots.map(slot => ({
        id: slot.id,
        openingTime: slot.openingTime,
        closingTime: slot.closingTime,
      })),
    }));

    this.timeSlotService.updateByUpdateTimeSlotDtos(updateTimeSlotDtos).subscribe((response: any) => {
      if (response.success) {
        console.log('Time slots saved successfully!',response);
      } else {
        console.log('Failed to save time slots!');
      }
    });
  }

  // Get the weekday name based on number (1-7)
  getWeekDayName(weekDay: number): string {
    const weekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    return weekDays[weekDay]; // Adjust the index for 1-7
  }

  // Open the modal to add or edit a time slot
  openModal(weekDayId: number): void {
    this.weekDayIdForModal = weekDayId;
    const weekDay = this.weekDayTimeSlots.find(day => day.weekDay === weekDayId);
    const modalRef = this.modalService.open(TimeSlotsModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.weekDayId = weekDayId;
    modalRef.componentInstance.timeSlots = weekDay?.timeSlots || [];

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.componentInstance.saveTimeSlot.subscribe((timeSlotData) => {
      this.addNewTimeSlot(timeSlotData, weekDayId);
      modalRef.close();
    });
  }

  // Add a new time slot to the selected weekday
  addNewTimeSlot(newSlot: { openingTime: string; closingTime: string }, weekDayId: number): void {
    const weekDay = this.weekDayTimeSlots.find(day => day.weekDay === weekDayId);
    if (weekDay) {
      const newSlotId = this.getNextSlotId(weekDay.timeSlots);
      weekDay.timeSlots.push({ id: newSlotId, ...newSlot });
    }
  }

  // Generate the next slot ID
  private getNextSlotId(timeSlots: { id: number }[]): number {
    return timeSlots.length > 0 ? Math.max(...timeSlots.map(slot => slot.id)) + 1 : 1;
  }

  // Delete a specific time slot
  deleteTimeSlot(weekDayId: number, slotId: number): void {
    const weekDay = this.weekDayTimeSlots.find(day => day.weekDay === weekDayId);
    if (weekDay) {
      weekDay.timeSlots = weekDay.timeSlots.filter(slot => slot.id !== slotId);
    }
  }
}
