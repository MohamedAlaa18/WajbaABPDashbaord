
export interface TimeSlotUpdateDetailDto {
  id: number;
  openingTime?: string;
  closingTime?: string;
}

export interface UpdateTimeSlotDto {
  weekDay: number;
  timeSlots: TimeSlotUpdateDetailDto[];
}
