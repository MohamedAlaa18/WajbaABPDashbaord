import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
import type { Base64ImageModel } from '../themes-contract/models';

export interface CouponDto extends EntityDto<number> {
  name?: string;
  code: number;
  discount: number;
  discountType: number;
  startDate?: string;
  endDate?: string;
  minimumOrderAmount: number;
  maximumDiscount: number;
  limitPerUser: number;
  countOfUsers: number;
  imageUrl?: string;
  description?: string;
  isExpired: boolean;
}

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
  branchid?: number;
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

export interface UpdateImageCoupon {
  id: number;
  model: Base64ImageModel;
}
