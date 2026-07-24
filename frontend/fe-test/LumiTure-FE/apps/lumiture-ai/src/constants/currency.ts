export enum Currency {
  HKD = 'HKD',
  IDR = 'IDR',
  MYR = 'MYR',
  TWD = 'TWD',
  PHP = 'PHP',
  SGD = 'SGD',
  USD = 'USD',
}

// label, symbol 參考：https://www.ifreesite.com/currency.htm
export const currencyOptions = [
  {
    label: 'Hong Kong dollar',
    value: Currency.HKD,
    iconUrl: '/images/currency/hk.svg',
    symbol: '$',
  },
  {
    label: 'Indonesian rupiah',
    value: Currency.IDR,
    iconUrl: '/images/currency/id.svg',
    symbol: 'Rp',
  },
  {
    label: 'Malaysian ringgit',
    value: Currency.MYR,
    iconUrl: '/images/currency/my.svg',
    symbol: 'RM',
  },
  {
    label: 'New Taiwan dollar',
    value: Currency.TWD,
    iconUrl: '/images/currency/tw.svg',
    symbol: '$',
  },
  {
    label: 'Philippine peso',
    value: Currency.PHP,
    iconUrl: '/images/currency/ph.svg',
    symbol: '₱',
  },
  {
    label: 'Singapore dollar',
    value: Currency.SGD,
    iconUrl: '/images/currency/sg.svg',
    symbol: '$',
  },
  {
    label: 'United States dollar',
    value: Currency.USD,
    iconUrl: '/images/currency/us.svg',
    symbol: '$',
  },
] as const;

export type CurrencyCode = keyof typeof Currency;

export type CurrencySymbol = (typeof currencyOptions)[number]['symbol'];
export type CurrencyOption = (typeof currencyOptions)[number];

export const currencyMap = Object.fromEntries(
  currencyOptions.map((option) => [option.value, option])
);
