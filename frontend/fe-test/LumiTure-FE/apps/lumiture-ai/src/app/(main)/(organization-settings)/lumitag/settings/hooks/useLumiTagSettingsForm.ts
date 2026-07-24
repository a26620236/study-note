import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CrossCloudValue, type PlatformsValue } from '@constants';
import { useGetLumiTag, type LumiTagScope } from '@hooks-api';

import {
  lumiTagSettingsSchema,
  type LumiTagFormData,
  type ValidatedLumiTagData,
} from '../zod/lumiTagSettings.schema';

function isNonFocusScope(
  scope: LumiTagScope
): scope is Omit<LumiTagScope, 'platform'> & { platform: PlatformsValue } {
  return scope.platform !== CrossCloudValue.FOCUS;
}

export function useLumiTagSettingsForm() {
  const tagId = useSearchParams().get('tagId');
  const { data: detail } = useGetLumiTag(tagId ?? '');
  const { name = '', values = [] } = detail?.data ?? {};

  const formValues = values.map((value) => ({
    ...value,
    scopes: value.scopes.filter(isNonFocusScope),
  }));

  return useForm<LumiTagFormData, unknown, ValidatedLumiTagData>({
    resolver: zodResolver(lumiTagSettingsSchema),
    defaultValues: { name: '', values: [] },
    values: detail && tagId ? { name, values: formValues } : undefined,
    shouldFocusError: false,
  });
}
