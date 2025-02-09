
export interface CreateRole {
  name?: string;
}

export interface RolesDto {
  id: number;
  name?: string;
}

export interface UpdateRole extends CreateRole {
  id: number;
}
