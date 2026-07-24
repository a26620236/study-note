import * as z from 'zod';

export const firstNameValidator = {
  firstName: z
    .string()
    .min(1, { message: 'First name cannot be empty' })
    .max(30, { message: 'Input cannot exceed 30 characters' })
    .regex(/^(?! )[A-Za-z\s]+(?<! )$/u, { message: 'Please only enter English letter' }),
};

export const lastNameValidator = {
  lastName: z
    .string()
    .min(1, { message: 'Last name cannot be empty' })
    .max(30, { message: 'Input cannot exceed 30 characters' })
    .regex(/^(?! )[A-Za-z\s]+(?<! )$/u, { message: 'Please only enter English letter' }),
};

export const emailValidator = {
  email: z
    .string()
    .min(1, { message: 'Email cannot be empty' })
    .pipe(
      z.email({
        message: 'Please enter a valid email address (e.g., name@example.com)',
      })
    ),
};

export const pwdValidator = {
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(20, { message: 'Password cannot exceed 20 characters.' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9@%!#$?]+$/u, {
      message: 'Password must be half-width English letters and numbers.',
    })
    .regex(/[@%!#$?]/u, { message: 'Password must contain a special character. (@%!#$?)' }),
};

interface CheckPwdIncludesNameParams {
  firstName: string;
  lastName: string;
  pwd: string;
}

export const checkPwdIncludesName = ({ firstName, lastName, pwd }: CheckPwdIncludesNameParams) => {
  // * 只有當 firstName 或 lastName 有值時才進行檢查
  if (!firstName && !lastName) return true;

  // * 如果有姓或名，才檢查密碼是否包含
  const hasFirstName = firstName && pwd.toLowerCase().includes(firstName.toLowerCase());
  const hasLastName = lastName && pwd.toLowerCase().includes(lastName.toLowerCase());

  return !hasFirstName && !hasLastName;
};
