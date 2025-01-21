import type { Base64ImageModel } from '../themes-contract/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateCouponDto {
  name: string;
  code: number;
  discount: number;
  discountType: number;
  startDate?: string;
  endDate?: string;
  minimumOrderAmount: number;
  maximumDiscount: number;
  limitPerUser: number;
  description?: string;
  image: Base64ImageModel;
}

export interface GetCouponsInput extends PagedAndSortedResultRequestDto {
  name?: string;
  branchid: number;
  discount?: number;
  discountype?: number;
  startdate?: string;
  enddate?: string;
  minimumOrderAmount?: number;
  maximumDiscount?: number;
  limitPerUser?: number;
  description?: string;
  code?: string;
  branchId?: number;
  isexpire?: boolean;
  isused?: boolean;
}

export interface UpdateCoupondto extends CreateUpdateCouponDto {
  id: number;
}
