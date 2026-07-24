import * as z from 'zod';

import {
  checkPwdIncludesName,
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  pwdValidator,
} from '../validators';

export const pwdFormSchema = z
  .object({
    ...firstNameValidator,
    ...lastNameValidator,
    ...emailValidator,
    ...pwdValidator,
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      const { firstName, lastName, password } = data;
      return checkPwdIncludesName({ firstName, lastName, pwd: password });
    },
    {
      message: 'Password cannot contain your username.',
      path: ['password'],
    }
  )
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Both passwords must match',
    path: ['passwordConfirm'],
  });
