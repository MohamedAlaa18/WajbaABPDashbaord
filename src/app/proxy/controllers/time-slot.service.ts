import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { UpdateTimeSlotDto } from '../dtos/time-slots-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class TimeSlotService {
  apiName = 'Default';
  

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/TimeSlot',
    },
    { apiName: this.apiName,...config });
  

  seedData = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/TimeSlot',
    },
    { apiName: this.apiName,...config });
  

  updateByUpdateTimeSlotDtos = (updateTimeSlotDtos: UpdateTimeSlotDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/TimeSlot',
      body: updateTimeSlotDtos,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
