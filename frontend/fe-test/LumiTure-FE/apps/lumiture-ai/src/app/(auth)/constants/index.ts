export const PWD_RULES = [
  { key: 'pwd-rule-1', text: '8 to 20 half-width english letters or numbers.' },
  { key: 'pwd-rule-2', text: '1 Special Symbol (@%!#$?)' },
  { key: 'pwd-rule-3', text: `Can't contain user's name` },
] as const;

export const BASE_FIELD_ATTRS = {
  required: true,
  fullWidth: true,
  margin: 'normal',
  InputProps: { size: 'large' },
  slotProps: { inputLabel: { shrink: true } },
} as const;

export const FIELD_PLACEHOLDERS = {
  FIRST_NAME: 'Please enter your first name in English',
  LAST_NAME: 'Please enter your last name in English',
  EMAIL: 'Please enter your email',
  PWD: 'Please enter your password',
  PWD_CONFIRM: 'Please enter your password again',
  BUSINESS_NAME: 'Please enter company business name',
  BUSINESS_PHONE: 'Please enter company business phone (only numbers)',
  PHONE_EXT: 'Please enter business phone extension',
  STATE: 'Please enter company state',
  ZIP_CODE: 'Please enter company zip code',
  CITY: 'Please enter company town / city',
  STREET_ADDR: 'Please enter company business address',
} as const;

export const FIELD_NAMES = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  EMAIL: 'email',
  PWD: 'password',
  PWD_CONFIRM: 'passwordConfirm',
  BUSINESS_NAME: 'businessName',
  BUSINESS_PHONE: 'businessPhone',
  PHONE_EXT: 'phoneExtension',
  COUNTRY: 'country',
  STATE: 'state',
  ZIP_CODE: 'zipCode',
  CITY: 'city',
  STREET_ADDR: 'streetAddress',
} as const;

export const FIELD_LABELS = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EMAIL: 'Email',
  PWD: 'Password',
  PWD_CONFIRM: 'Confirm Password',
  BUSINESS_NAME: 'Business Name',
  BUSINESS_PHONE: 'Business Phone',
  PHONE_EXT: 'Extension',
  STATE: 'State',
  ZIP_CODE: 'Zip Code',
  CITY: 'Town / City',
  STREET_ADDR: 'Business Address',
} as const;
