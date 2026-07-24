import { Tooltip, Typography } from '@mui/material';

import { nFormatter } from '@shared/utils';

import type { AiQuotaItem } from '@hooks-api';

import { getAiQuotaColor } from './utils/getAiQuotaColor';
import { getAiQuotaStatus } from './utils/getAiQuotaStatus';
import { getAiQuotaTooltip } from './utils/getAiQuotaTooltip';

interface AiQuotaUsageTextProps {
  quota: AiQuotaItem;
}

const LABELS = {
  suffix: 'left',
};

export function AiQuotaUsageText({ quota }: AiQuotaUsageTextProps) {
  const { remaining, total } = quota;
  const status = getAiQuotaStatus(remaining, total);

  // title 為空字串時 MUI Tooltip 不顯示（normal 狀態無文案）
  return (
    <Tooltip title={getAiQuotaTooltip(quota)}>
      <Typography
        component="span"
        variant="inherit"
        data-testid="ai-quota-usage-text"
        sx={{ color: getAiQuotaColor(status), fontWeight: 'bold' }}
      >
        {`${nFormatter({ num: remaining })} / ${nFormatter({ num: total })} ${LABELS.suffix}`}
      </Typography>
    </Tooltip>
  );
}
