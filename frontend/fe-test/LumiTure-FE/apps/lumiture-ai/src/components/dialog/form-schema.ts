import * as z from 'zod';

const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ message: 'Invalid email format' }));
const multipleEmailsSchema = ({ isRequired }: { isRequired: boolean }) =>
  z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!isRequired && !value) return true;
        const emails = value?.split(',').map((email) => email.trim()) ?? [];
        const areAllValid = emails.every((email) => emailSchema.safeParse(email).success);
        const hasDuplicates = new Set(emails).size !== emails.length;
        return areAllValid && !hasDuplicates;
      },
      {
        message: 'Some emails are invalid or improperly formatted or duplicate emails found',
      }
    );

const EditGroupSchema = z.object({
  groupName: z.string().trim().min(1, { message: 'Group name cannot be empty or whitespace' }),
  managerEmails: multipleEmailsSchema({ isRequired: false }),
});

const inviteUserFormSchema = z.object({
  role: z.string().min(1, { message: 'Role cannot be empty' }),
  userEmails: multipleEmailsSchema({ isRequired: true }),
});

const updateUserFormSchema = z.object({
  userId: z.string(),
  role: z.string().min(1, { message: 'Role cannot be empty' }),
});

export { EditGroupSchema, inviteUserFormSchema, updateUserFormSchema };
