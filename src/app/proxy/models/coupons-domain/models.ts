// import type { FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';
import type { DiscountType } from '../../enums/discount-type.enum';

export interface Coupon {
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
