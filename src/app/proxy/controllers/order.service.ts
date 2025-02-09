import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { IActionResult } from '@proxy/microsoft/asp-net-core/mvc';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';

  private getToken(): string {
    return this.cookieService.get('userToken');
  }

  getAllOrdersForCustomerByBranchIdAndPageSizeAndPageNumber = (branchId: number, pageSize?: number, pageNumber?: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Order/Kitchen-customer-orders',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { branchId, pageSize, pageNumber },
    },
    { apiName: this.apiName,...config });


  getDailySalesByBranchidAndNumberOfDays = (branchid: number, numberOfDays: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Order/daily-sales',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { branchid, numberOfDays },
    },
    { apiName: this.apiName,...config });


  salesReportByBranchIdAndStartDateAndEndDateAndDateorderAndStatusAndOrdertypeAndOrderIdAndFrompriceAndTopriceAndPaidstatusAndPageNumberAndPageSize = (branchId: number, startDate?: string, endDate?: string, dateorder?: string, status?: number, ordertype?: number, orderId?: number, fromprice?: number, toprice?: number, paidstatus?: string, pageNumber?: number, pageSize?: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Order/SalesReport',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { branchId, startDate, endDate, dateorder, status, ordertype, orderId, fromprice, toprice, paidstatus, pageNumber, pageSize },
    },
    { apiName: this.apiName,...config });


  updateOrderStatusByOrderIdAndStatus = (orderId: number, status: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Order/Kitchen-update-order-status',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Manually adding the token
      },
      params: { orderId, status },
    },
    { apiName: this.apiName,...config });

    constructor(private restService: RestService, private cookieService: CookieService) { }
}
