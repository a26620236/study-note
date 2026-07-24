import { format } from 'date-fns';

import { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import type {
  CustomBudgetBatchForm,
  CustomBudgetForm,
} from '@app/(main)/budget/customized/components/types';
import type { GetCustomBudgetDetailsRes } from '@hooks-api';

export const formatGetCustomBudgetDetailsRes = (res: GetCustomBudgetDetailsRes): CustomBudgetForm =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/consistent-type-assertions -- legacy code
  ({
    ...res,
    [FORM_ID.START_DATE]:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      res[FORM_ID.START_DATE] === null ? null : new Date(res[FORM_ID.START_DATE] as string),
    [FORM_ID.END_DATE]:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      res[FORM_ID.END_DATE] === null ? null : new Date(res[FORM_ID.END_DATE] as string),
    [FORM_ID.RULES]: res[FORM_ID.RULES].map((_rule) => ({
      ..._rule,
      services: _rule.services
        ? _rule.services.map((_service) => ({
            name: _service,
            id: _service,
          }))
        : null,
    })),
  }) as CustomBudgetForm;

export const formatCustomBudgetForm = (form: CustomBudgetForm | CustomBudgetBatchForm) => {
  const isCustomBudgetForm = (
    form: CustomBudgetForm | CustomBudgetBatchForm
  ): form is CustomBudgetForm => FORM_ID.RULES in form;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { [FORM_ID.RECIPIENTS_INPUT]: _recipientsInput, ...rest } = form;

  const data = {
    ...rest,
    [FORM_ID.START_DATE]: form[FORM_ID.START_DATE]
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
        format(form[FORM_ID.START_DATE] as Date, 'yyyy-MM-dd')
      : null,
    [FORM_ID.END_DATE]: form[FORM_ID.END_DATE]
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
        format(form[FORM_ID.END_DATE] as Date, 'yyyy-MM-dd')
      : null,
  };

  if (isCustomBudgetForm(form)) {
    return {
      ...data,
      [FORM_ID.RULES]: form[FORM_ID.RULES].map((_rule) => ({
        ..._rule,
        services: _rule.services ? _rule.services.map((service) => service.name) : null,
      })),
    };
  }

  return data;
};
