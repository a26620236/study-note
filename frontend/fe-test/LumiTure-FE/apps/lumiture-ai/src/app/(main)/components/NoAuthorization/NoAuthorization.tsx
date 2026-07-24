import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useSession } from 'next-auth/react';

import { Icon } from '@lumiture-ui';

import { DEFAULT_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import { ORG_SETTINGS_PATHS, PlatformsValue, Role } from '@constants';

interface NoAuthorizationProps {
  adminDesc: string;
  nonAdminDesc: string;
  adminTitle?: string;
  adminIconUrl?: string;
  nonAdminTitle?: string;
  nonAdminIconUrl?: string;
}

const NoAuthorization = ({
  adminDesc,
  nonAdminDesc,
  adminTitle,
  adminIconUrl,
  nonAdminTitle,
  nonAdminIconUrl,
}: NoAuthorizationProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const character = session?.user.group?.character;

  const adminInfo = {
    title: adminTitle ?? DEFAULT_EMPTY_CONTENT.noAuth.title,
    desc: adminDesc,
    iconUrl: adminIconUrl ?? DEFAULT_EMPTY_CONTENT.noAuth.iconUrl,
  };
  const nonAdminInfo = {
    title: nonAdminTitle ?? DEFAULT_EMPTY_CONTENT.noAuth.title,
    desc: nonAdminDesc,
    iconUrl: nonAdminIconUrl ?? DEFAULT_EMPTY_CONTENT.noAuth.iconUrl,
  };

  const handleAddAuthClick = () => {
    router.push(
      ORG_SETTINGS_PATHS.billingDataIntegration.pathname.replace('[platform]', PlatformsValue.GCP)
    );
  };

  return (
    <Stack sx={{ height: '100%', alignSelf: 'center', alignItems: 'center' }}>
      {character === Role.OWNER || character === Role.ADMIN ? (
        <EmptyState type="noAuth" {...adminInfo}>
          <Button startIcon={<Icon name="add" />} onClick={handleAddAuthClick} sx={{ mt: 6 }}>
            Add Your Authorization
          </Button>
        </EmptyState>
      ) : (
        <EmptyState type="noAuth" {...nonAdminInfo} />
      )}
    </Stack>
  );
};

export default NoAuthorization;
