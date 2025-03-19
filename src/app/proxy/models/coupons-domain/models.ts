import type { FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';

export interface Coupon extends FullAuditedEntity<number> {
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
