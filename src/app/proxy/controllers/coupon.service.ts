import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ApiResponse } from '../apiresponse/models';
import type { CouponDto, CreateUpdateCouponDto, GetCouponsInput, UpdateCoupondto, UpdateImageCoupon } from '../dtos/coupon-contract/models';
import type { ActionResult, IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCouponDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Coupon',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'DELETE',
      url: `/api/Coupon/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getById = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionResult<ApiResponse<CouponDto>>>({
      method: 'GET',
      url: `/api/Coupon/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: GetCouponsInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/Coupon',
      params: { name: input.name, branchid: input.branchid, discount: input.discount, discountype: input.discountype, startdate: input.startdate, enddate: input.enddate, minimumOrderAmount: input.minimumOrderAmount, maximumDiscount: input.maximumDiscount, limitPerUser: input.limitPerUser, description: input.description, code: input.code, branchId: input.branchId, isexpire: input.isexpire, isused: input.isused, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateCoupondto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Coupon',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateImageByCoupon = (coupon: UpdateImageCoupon, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'PUT',
      url: '/api/Coupon/UpdateImage',
      body: coupon,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
