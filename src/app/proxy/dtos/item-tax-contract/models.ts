
export interface CreateItemTaxDto {
  name?: string;
  code: number;
  taxRate: number;
  status: number;
}

export interface UpdateItemTaxDto extends CreateItemTaxDto {
  id: number;
}
