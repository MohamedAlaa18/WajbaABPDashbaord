import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { OrderDTO } from '../../dtos/order-contract/models';
import type { OrderType } from '../../enums/order-type.enum';
import type { IActionResult } from '../../microsoft/asp-net-core/mvc/models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PosOrderService {
  apiName = 'Default';

  private getToken(): string {
    return this.cookieService.get('userToken');
  }

  addOrderByOrderDto = (orderDto: OrderDTO, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/PosOrder',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      body: orderDto,
    },
    { apiName: this.apiName,...config });


  deleteOrderByOrderId = (orderId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/PosOrder/delete-order/${orderId}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
    { apiName: this.apiName,...config });


  getAllOrdersByBranchIdAndStartDateAndOrderidAndOrderTypeAndEndDateAndDateorderAndStatusAndFrompriceAndTopriceAndPageNumberAndPageSize = (branchId: number, startDate?: string, orderid?: number, orderType?: number, endDate?: string, dateorder?: string, status?: number, fromprice?: number, toprice?: number, pageNumber?: number, pageSize?: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/PosOrder/All-POS-Orders/${branchId}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { startDate, orderid, orderType, endDate, dateorder, status, fromprice, toprice, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });


  getAllOrdersForEmployee = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/PosOrder/employee-orders',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
    { apiName: this.apiName,...config });


  getOrderByIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/PosOrder/PosOrder/${id}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
    { apiName: this.apiName,...config });

    constructor(private restService: RestService, private cookieService: CookieService) { }
}
