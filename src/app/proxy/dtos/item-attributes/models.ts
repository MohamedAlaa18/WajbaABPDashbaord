
export interface CreateItemAttributeDto {
  name: string;
  status: number;
}

export interface UpdateItemAttributeDto extends CreateItemAttributeDto {
  id: number;
}
