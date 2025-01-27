
export interface AttributeDto {
  attributeName?: string;
  variations: VariationDTO[];
}

export interface ItemAddonDTO {
  id: number;
  name?: string;
  additionalPrice: number;
  imageUrl?: string;
}

export interface ItemExtraDTO {
  id: number;
  name?: string;
  additionalPrice: number;
}

export interface ItemWithDependenciesDto {
  id: number;
  name?: string;
  description?: string;
  note?: string;
  status: number;
  isFeatured: boolean;
  imageUrl?: string;
  price: number;
  taxValue: number;
  categoryId?: number;
  categoryName?: string;
  itemType: number;
  isDeleted: boolean;
  branchesIds: number[];
  itemAddons: ItemAddonDTO[];
  itemExtras: ItemExtraDTO[];
  attributes: AttributeDto[];
}

export interface VariationDTO {
  id: number;
  name?: string;
  note?: string;
  additionalPrice: number;
  itemAttributesId?: number;
}
