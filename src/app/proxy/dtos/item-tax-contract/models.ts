import type { Status } from '../../enums/status.enum';

export interface CreateItemTaxDto {
  name?: string;
  code: number;
  taxRate: number;
  status: Status;
}

export interface UpdateItemTaxDto extends CreateItemTaxDto {
  id: number;
}
