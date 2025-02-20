
export interface CreateOTPDto {
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}

export interface UpdateOtpDto {
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}
