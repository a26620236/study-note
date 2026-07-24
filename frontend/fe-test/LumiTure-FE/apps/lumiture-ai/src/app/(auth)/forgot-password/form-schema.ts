import * as z from 'zod';

import { emailValidator } from '../validators';

const forgotPwdFormSchema = z.object({
  ...emailValidator,
});

export default forgotPwdFormSchema;
