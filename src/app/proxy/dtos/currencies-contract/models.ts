
export interface CreateUpdateCurrenciesDto {
  name: string;
  symbol: string;
  code: string;
  exchangeRate: number;
  isCryptoCurrency: boolean;
}

export interface UpadteCurrency extends CreateUpdateCurrenciesDto {
  id: number;
}
