import { matchIsValidTel } from 'mui-tel-input';
import * as z from 'zod';

import { emailValidator, firstNameValidator, lastNameValidator } from '../validators';

const signUpFormSchema = z.object({
  user: z.object({
    ...firstNameValidator,
    ...lastNameValidator,
    ...emailValidator,
    isActive: z.boolean(), // * Hidden info for backend
  }),
  organization: z.object({
    businessName: z
      .string()
      .min(1, { message: 'Business name cannot be empty.' })
      .refine((value) => /^[a-zA-Z0-9]/u.test(value), {
        message: 'Please start with an alphanumeric character',
      })
      .refine((value) => /^[a-zA-Z0-9]+(\x20[a-zA-Z0-9&.,'*!-]+)*$/u.test(value), {
        message: `Please only contain spaces and common special symbols (&.,'*!-)`,
      }),
    businessPhone: z
      .string()
      .min(1, { message: 'Business phone cannot be empty' })
      .refine((value) => matchIsValidTel(value), {
        message: 'Please enter a valid business phone number',
      }),
    phoneExtension: z
      .string()
      .regex(/^[0-9]*$/u, { message: 'Please only contain numbers' })
      .max(5, { message: 'Input cannot exceed 5 numbers' })
      .or(z.literal('')),
    country: z.string().min(1, { message: 'Country / Region cannot be empty' }),
    state: z.string(),
    zipCode: z.string().min(1, { message: 'Zip code cannot be empty' }),
    city: z.string().min(1, { message: 'City / Town cannot be empty' }),
    streetAddress: z.string().min(1, { message: 'Street address cannot be empty' }),
  }),
});

export default signUpFormSchema;
