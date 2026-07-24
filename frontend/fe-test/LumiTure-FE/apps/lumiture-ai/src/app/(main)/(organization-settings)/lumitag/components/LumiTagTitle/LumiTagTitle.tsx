'use client';

import { Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';

import { HStack, Icon } from '@lumiture-ui';

import CurrencySelector from '@components/CurrencySelector/CurrencySelector';
import { useGetLumiTagList } from '@hooks-api';

const LABELS = {
  title: 'LumiTag',
  description:
    "Please be aware that cost figures may still differ from actual usage, depending on the cloud provider's data availability and processing timeline.",
};

interface UpdateTimeProps {
  updateTitle: string;
  updateTime: string;
}

const UpdateTime = ({ updateTitle, updateTime }: UpdateTimeProps) => (
  <HStack gap={1}>
    <Typography variant="captionMedium" color="text.secondary">
      {updateTitle}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {updateTime}
    </Typography>
  </HStack>
);

export function LumiTagTitle() {
  const { data: lumiTagResponse } = useGetLumiTagList();
  const lumiTagData = lumiTagResponse?.data;

  const lastUpdatedAt = lumiTagData?.metricsBanner.updateTime;
  const nextUpdateAt = lumiTagData?.metricsBanner.nextUpdateTime;

  const formattedLastUpdatedAt = lastUpdatedAt ? format(lastUpdatedAt, 'dd/MM/yyyy HH:mm') : '-';
  const formattedNextUpdateAt = nextUpdateAt ? format(nextUpdateAt, 'dd/MM/yyyy HH:mm') : '-';

  return (
    <HStack alignItems="center" justifyContent="space-between">
      <Typography variant="h4">{LABELS.title}</Typography>
      <HStack gap={5} alignItems="center">
        <UpdateTime updateTitle="Last Updated" updateTime={formattedLastUpdatedAt} />
        <UpdateTime updateTitle="Next Update" updateTime={formattedNextUpdateAt} />
        <Tooltip title={LABELS.description}>
          <HStack alignItems="center" justifyContent="center">
            <Icon name="info" sx={{ fontSize: 16, color: 'text.secondary', cursor: 'pointer' }} />
          </HStack>
        </Tooltip>
        <CurrencySelector />
      </HStack>
    </HStack>
  );
}
