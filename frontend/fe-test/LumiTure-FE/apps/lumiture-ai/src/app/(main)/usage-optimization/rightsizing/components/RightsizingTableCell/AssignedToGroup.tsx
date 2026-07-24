import { Typography } from '@mui/material';

import EllipsisTooltipCell from '@components/table/EllipsisTooltipCell';
import type { RecommendationItem } from '@hooks-api';

interface AssignedToGroupProps {
  assignTo: RecommendationItem['assignTo'];
}

export function AssignedToGroup({ assignTo }: AssignedToGroupProps) {
  const TooltipContent = () => (
    <Typography
      component="ul"
      sx={{
        pl: 4,
      }}
    >
      {assignTo?.map((group) => (
        <Typography key={group} component="li">
          {group}
        </Typography>
      ))}
    </Typography>
  );

  return (
    <EllipsisTooltipCell
      text={assignTo?.join(', ') || '--'}
      variant="body1"
      tooltipText={<TooltipContent />}
    />
  );
}
