import type * as z from 'zod';

import type forgotPwdFormSchema from '@app/(auth)/forgot-password/form-schema';
import type { pwdFormSchema } from '@app/(auth)/form-schemas';
import type loginFormSchema from '@app/(auth)/login/form-schema';
import type signUpFormSchema from '@app/(auth)/sign-up/form-schema';

export type PostLoginPayload = z.infer<typeof loginFormSchema>;
export type PostSignUpPayload = z.infer<typeof signUpFormSchema>;
export type PostActivatePayload = z.infer<typeof pwdFormSchema>;
export type PostForgotPwdPayload = z.infer<typeof forgotPwdFormSchema>;
export type PostResetPwdPayload = z.infer<typeof pwdFormSchema>;

export type PostSignUpResponse = PostSignUpPayload;
export interface PostLoginResponse {
  refresh: string;
  access: string;
}
export type PostActivateResponse = Pick<PostActivatePayload, 'email' | 'firstName' | 'lastName'>;
export interface PostForgotPwdResponse {
  email: string;
  lastLogin: string | null;
}
export type PostResetPwdResponse = Pick<PostResetPwdPayload, 'email' | 'firstName' | 'lastName'>;
export interface GetVerifiedUserResponse {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin: string | null;
}

export interface PatchDefaultUserGroupPayload {
  groupId: string;
}
