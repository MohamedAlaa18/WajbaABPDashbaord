
export interface CreateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  status: number;
  type: number;
  profilePhoto?: string;
  points: number;
  password?: string;
  confirmPassword?: string;
  branchList: number[];
  customerRoleList: number[];
}

export interface GetUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
}

export interface GetUserListDto {
  fullName?: string;
  type?: number;
  status?: number;
  email?: string;
  phone?: string;
  maxResultCount: number;
  skipCount: number;
}

export interface LogInWajbaUserDto {
  phone?: string;
}

export interface UpdateWajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
  branchList: number[];
  customerRoleList: number[];
}

export interface WajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
}
