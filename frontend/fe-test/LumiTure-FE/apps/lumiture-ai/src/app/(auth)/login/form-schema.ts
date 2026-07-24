import * as z from 'zod';

import { emailValidator, pwdValidator } from '../validators';

const loginFormSchema = z.object({
  ...emailValidator,
  ...pwdValidator,
});

export default loginFormSchema;
