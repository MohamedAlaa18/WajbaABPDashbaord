
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
}

export interface GetUserDto {
  id?: string;
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
  maxResultCount: number;
  skipCount: number;
}

export interface LogInWajbaUserDto {
  phone?: string;
  password?: string;
}

export interface UpdateWajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
}

export interface WajbaUserDto {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  type: number;
  status: number;
}
