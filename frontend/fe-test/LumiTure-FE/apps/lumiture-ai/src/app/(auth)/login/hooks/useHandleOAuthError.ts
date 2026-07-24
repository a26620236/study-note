import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { popErrorToast } from '@shared/utils';

import { OAuthError } from '../constants/login';
import { getOAuthErrorMessage } from '../utils/getOAuthErrorMessage';

interface UseHandleOAuthErrorParams {
  setOpenNotInvitedDialog: (open: boolean) => void;
}

export default function useHandleOAuthError({
  setOpenNotInvitedDialog,
}: UseHandleOAuthErrorParams) {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (!oauthError) return;

    // not invited error is a special case, it is not an error from next-auth, but from backend api response
    if (oauthError === OAuthError.NotInvited) {
      setOpenNotInvitedDialog(true);
    } else {
      popErrorToast({ description: getOAuthErrorMessage(oauthError) });
    }
  }, [oauthError, setOpenNotInvitedDialog]);
}
