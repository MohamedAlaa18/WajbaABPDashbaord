import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { OrderDTO } from '../../dtos/order-contract/models';
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
      { apiName: this.apiName, ...config });


  deleteOrderByOrderId = (orderId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/PosOrder/delete-order/${orderId}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
      { apiName: this.apiName, ...config });


  getAllOrdersByBranchIdAndStartDateAndOrderIdAndOrderTypeAndEndDateAndDateOrderAndStatusAndFromPriceAndToPrice = (branchId: number, startDate?: string, orderId?: number, orderType?: number, endDate?: string, dateOrder?: string, status?: number, fromPrice?: number, toPrice?: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/PosOrder/All-POS-Orders/${branchId}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { startDate, orderId, orderType, endDate, dateOrder, status, fromPrice, toPrice },
    },
      { apiName: this.apiName, ...config });


  getAllOrdersForEmployee = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/PosOrder/employee-orders',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
      { apiName: this.apiName, ...config });


  getOrderByIdById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/PosOrder/PosOrder/${id}`,
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
    },
      { apiName: this.apiName, ...config });

  constructor(private restService: RestService, private cookieService: CookieService) { }
}
