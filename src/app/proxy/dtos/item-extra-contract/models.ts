import type { Status } from '../../enums/status.enum';

export interface CreateItemExtraDto {
  name?: string;
  status: Status;
  additionalPrice: number;
  itemId: number;
}

export interface UpdateItemExtraDto extends CreateItemExtraDto {
}
