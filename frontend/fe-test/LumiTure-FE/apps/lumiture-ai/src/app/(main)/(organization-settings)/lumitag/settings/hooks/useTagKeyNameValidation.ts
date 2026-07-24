import { useMemo } from 'react';

import { useGetLumiTagList } from '@hooks-api';

import { LABELS as ERROR_MESSAGES, TAG_KEY_REGEX } from '../constants/lumiTagSettings';

interface UseTagKeyNameValidationParams {
  name: string;
  isEditMode: boolean;
}

export function useTagKeyNameValidation({ name, isEditMode }: UseTagKeyNameValidationParams): {
  errorMessage: string | null;
} {
  const { data: listData } = useGetLumiTagList();

  const errorMessage = useMemo(() => {
    // 編輯模式 Tag Key 是 disabled、改不了，重複檢查無意義
    if (isEditMode) return null;
    if (!name) return null;

    if (!TAG_KEY_REGEX.test(name)) {
      return ERROR_MESSAGES.nameFormat;
    }

    const existingNames = listData?.data.tags ?? [];
    const isDuplicate = existingNames.some((tag) => tag.name.toLowerCase() === name.toLowerCase());

    if (isDuplicate) {
      return ERROR_MESSAGES.nameDuplicate(name);
    }

    return null;
  }, [isEditMode, name, listData]);

  return { errorMessage };
}
