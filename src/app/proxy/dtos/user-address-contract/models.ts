
export interface CreateUserAddressDto {
  title?: string;
  longitude?: number;
  latitude?: number;
  wajbaUserId?: number;
  buildingName?: string;
  street?: string;
  apartmentNumber?: string;
  floor?: string;
  addressLabel?: string;
  addressType: number;
}

export interface UpdateUserAddressDto {
  id: number;
  title?: string;
  longitude?: number;
  latitude?: number;
  wajbaUserId?: number;
  buildingName?: string;
  street?: string;
  apartmentNumber?: string;
  floor?: string;
  addressLabel?: string;
  addressType: number;
}
