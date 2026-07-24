'use client';

import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@lumiture-ui';

import type { TierTwoGroupsInfos } from '@hooks-api';

interface ResourceButtonProps {
  row: TierTwoGroupsInfos;
  tierOneGroupId: string;
}

export function ResourceButton({ row, tierOneGroupId }: ResourceButtonProps) {
  const router = useRouter();
  const buttonText = row.resource && row.resource > 1 ? `Resources` : 'Resource';

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(
      `/group-list/tier-one-groups/${tierOneGroupId}/tier-two-groups/${row.id}?tab=resources`
    );
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
