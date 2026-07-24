import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { MAIN_PATHS } from '@constants';

interface UseHandleAfterLoginSuccessProps {
  setOpenSelectUserRoleDialog: (open: boolean) => void;
}

export function useHandleAfterLoginSuccess({
  setOpenSelectUserRoleDialog,
}: UseHandleAfterLoginSuccessProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const isLogin = !!session?.user.access;
  const hasDefaultRoleGroup = !!session?.user.group?.groupId;

  useEffect(() => {
    if (!isLogin) return;

    if (!hasDefaultRoleGroup) {
      setOpenSelectUserRoleDialog(true);
      return;
    }
    router.push(MAIN_PATHS.overview.pathname);
  }, [isLogin, hasDefaultRoleGroup, setOpenSelectUserRoleDialog, router]);
}
