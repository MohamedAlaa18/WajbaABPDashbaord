import type { Status } from '../enums/status.enum';
import type { DiscountType } from '../enums/discount-type.enum';
import type { IFormFile } from '../microsoft/asp-net-core/http/models';

export interface CreateUpdateOfferDto {
  id: number;
  name?: string;
  status: Status;
  startDate?: string;
  endDate?: string;
  discountPercentage: number;
  discountType: DiscountType;
  image: IFormFile;
  description?: string;
  branchId: number;
}
