'use client';

import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import { sendGAEvent } from '@next/third-parties/google';

import { Button } from '@lumiture-ui';

import { EVENT_GROUP_LIST, type Depth, type Role } from '@constants';
import type { TierOneGroupsInfos } from '@hooks-api';

interface ResourceButtonProps {
  row: TierOneGroupsInfos;
  eventTrackingIdentity: {
    role?: Role;
    depth?: Depth;
  };
}

export function ResourceButton({ row, eventTrackingIdentity }: ResourceButtonProps) {
  const router = useRouter();
  const buttonText = row.resource && row.resource > 1 ? `Resources` : 'Resource';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    sendGAEvent('event', EVENT_GROUP_LIST.CLICK_CHECK_T1_RESOURCE, eventTrackingIdentity);
    router.push(`/group-list/tier-one-groups/${row.id}?tab=resources`);
  };

  return (
    <Button
      size="small"
      variant="link"
      disabled={!row.id || row.isOptimizeUpdate}
      isLoading={row.isOptimizeUpdate}
      onClick={handleClick}
      sx={{
        fontWeight: 500,
      }}
      data-testid="resource-button"
    >
      {`${row.resource} ${buttonText}`}
    </Button>
  );
}
