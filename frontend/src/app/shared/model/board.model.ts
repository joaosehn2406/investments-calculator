export type PeriodType = 'year' | 'month';

export const CURRENCIES = {
  USD: {symbol: '$', name: 'US Dollar', locale: 'en-US'},
  BRL: {symbol: 'R$', name: 'Real', locale: 'pt-BR'},
  EUR: {symbol: '€', name: 'Euro', locale: 'de-DE'},
  GBP: {symbol: '£', name: 'Pound', locale: 'en-GB'},
} as const;

export type CurrencyType = keyof typeof CURRENCIES;

export interface BoardModel {
  initialInvestment: number;
  financialContribution: number;
  expectedReturn: number;
  duration: number;
  period: PeriodType;
  currency: CurrencyType;
}
