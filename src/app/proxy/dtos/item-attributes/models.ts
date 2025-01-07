import type { Status } from '../../enums/status.enum';

export interface CreateItemAttributeDto {
  name: string;
  status: Status;
}

export interface UpdateItemAttributeDto extends CreateItemAttributeDto {
  id: number;
}
