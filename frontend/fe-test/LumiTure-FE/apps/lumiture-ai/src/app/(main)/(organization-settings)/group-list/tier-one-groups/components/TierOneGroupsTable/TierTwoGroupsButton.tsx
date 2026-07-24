import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import { sendGAEvent } from '@next/third-parties/google';

import { Button } from '@lumiture-ui';

import { EVENT_GROUP_LIST, type Depth, type Role } from '@constants';
import type { TierOneGroupsInfos } from '@hooks-api';

interface TierTwoGroupsButtonProps {
  row: TierOneGroupsInfos;
  eventTrackingIdentity: {
    role?: Role;
    depth?: Depth;
  };
}

export function TierTwoGroupsButton({ row, eventTrackingIdentity }: TierTwoGroupsButtonProps) {
  const router = useRouter();
  const buttonText = row.tier2Group && row.tier2Group > 1 ? `Groups` : 'Group';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    sendGAEvent('event', EVENT_GROUP_LIST.CLICK_CHECK_T1_T2GROUP, eventTrackingIdentity);
    router.push(`/group-list/tier-one-groups/${row.id}?tab=tier-2-groups`);
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
      data-testid="tier-two-groups-button"
    >
      {`${row.tier2Group} ${buttonText}`}
    </Button>
  );
}
