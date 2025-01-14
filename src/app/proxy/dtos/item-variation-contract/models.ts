import type { Status } from '../../enums/status.enum';

export interface CreateItemVariationDto {
  name?: string;
  note?: string;
  status: Status;
  additionalPrice: number;
  itemAttributesId: number;
  itemId: number;
}

export interface UpdateItemVariationDto extends CreateItemVariationDto {
}
