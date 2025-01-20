
export interface CreateUpdateOTPDto {
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}

export interface UpdateOtpDto {
  type: number;
  digitLimit: number;
  expiryTimeInMinutes: number;
}
