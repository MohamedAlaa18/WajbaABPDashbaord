import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateOrderDto } from '../dtos/order-contract/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';
  

  createOrderByOrderDtoAndEmployeeId = (orderDto: CreateOrderDto, employeeId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Order/create-order',
      params: { employeeId },
      body: orderDto,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
