import type { CurrencyPosition } from '../../enums/currency-position.enum';
import type { LanguageSwitch } from '../../enums/language-switch.enum';

export interface CreateSiteDto {
  name: string;
  email: string;
  iosappLink: string;
  androidAPPLink: string;
  copyrights: string;
  googleMapKey: string;
  digitAfterDecimal: number;
  currencyPosition: CurrencyPosition;
  languageSwitch: LanguageSwitch;
  defaultBranch: number;
  defaultCurrency: number;
  defaultLanguage: number;
}
