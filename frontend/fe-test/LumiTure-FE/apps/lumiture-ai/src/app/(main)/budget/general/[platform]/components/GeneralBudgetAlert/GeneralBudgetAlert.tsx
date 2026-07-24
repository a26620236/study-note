import { useState } from 'react';

import { Skeleton, Typography } from '@mui/material';
import { isEmpty, omit } from 'lodash-es';

import { Button, HStack, Icon } from '@lumiture-ui';
import { nFormatter } from '@shared/utils';

import { useGetGeneralAlerts } from '@hooks-api';

import { EditAlertDialog } from './EditAlertDialog';

interface BudgetAlertProps {
  thresholds: number[] | null[];
}

const LABELS = {
  noAlerts: 'No alerts are configured.',
  alertReach: 'You will receive alert when the cost reach',
  percentMonthly: '% of the monthly budget.',
  alertSettings: 'Alert Settings',
};

const EmptyBudgetAlert = () => (
  <>
    <Icon name="notifications_off" sx={{ fontSize: 16, color: 'text.hint', mr: 1 }} />
    <Typography variant="caption" color="text.secondary">
      {LABELS.noAlerts}
    </Typography>
  </>
);

const BudgetAlert = ({ thresholds }: BudgetAlertProps) => (
  <>
    <Icon name="notifications" sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
    <HStack>
      <Typography variant="caption">{LABELS.alertReach}</Typography>
      <HStack sx={{ mx: 1 }}>
        {thresholds.map((threshold, index) => (
          <Typography key={threshold} variant="bodyBold">
            {`${index === 0 ? '' : ', '}${nFormatter({ num: threshold })}`}
          </Typography>
        ))}
      </HStack>
      <Typography variant="caption">{LABELS.percentMonthly}</Typography>
    </HStack>
  </>
);

export const GeneralBudgetAlert = () => {
  const { data, isLoading, isSuccess } = useGetGeneralAlerts();
  const generalAlerts = data?.data;
  const { availableActions, thresholds = [] } = generalAlerts ?? {};

  const isEmptyAlerts = isEmpty(thresholds);
  const hasEditAuth = availableActions?.editAlerts;

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const handleOpenEditDialog = () => setIsOpenEditDialog(true);
  const handleCloseEditDialog = () => setIsOpenEditDialog(false);

  return (
    <HStack alignItems="center" sx={{ mt: 2, mb: 6 }}>
      {isLoading && <Skeleton width={400} height={30} />}
      {isSuccess && (
        <>
          {isEmptyAlerts ? <EmptyBudgetAlert /> : <BudgetAlert thresholds={thresholds} />}
          {hasEditAuth && (
            <Button
              variant="link"
              startIcon={<Icon name="settings" />}
              onClick={handleOpenEditDialog}
            >
              <Typography variant="bodyBold">{LABELS.alertSettings}</Typography>
            </Button>
          )}
          <EditAlertDialog
            isOpen={isOpenEditDialog}
            onClose={handleCloseEditDialog}
            defaultValues={omit(generalAlerts, 'availableActions')}
          />
        </>
      )}
    </HStack>
  );
};
