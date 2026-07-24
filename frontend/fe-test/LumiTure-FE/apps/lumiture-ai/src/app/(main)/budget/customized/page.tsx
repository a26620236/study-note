'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Button, Icon } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

import OverviewTable from '@app/(main)/budget/customized/components/OverviewTable';
import { RemoveDialog } from '@app/(main)/budget/customized/components/RemoveDialog';
import { CreateAlert } from '@app/(main)/budget/customized/components/types';
import NoAuthorization from '@app/(main)/components/NoAuthorization/NoAuthorization';
import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import TableSkeleton from '@components/table/TableSkeleton';
import UpdateAt from '@components/UpdateAt';
import { BUDGET_PATHS } from '@constants';
import {
  useDeleteCustomizedAlert,
  useGetCustomizedAlerts,
  useGetResourcesAssignmentStatus,
  usePatchCustomizedAlertStatus,
  type CustomizedAlerts,
} from '@hooks-api';

const CustomizedBudgetPage = () => {
  const { data: resourcesAssignmentStatus, isLoading: isResourcesAssignmentStatusLoading } =
    useGetResourcesAssignmentStatus();
  const hasAssignedResources = resourcesAssignmentStatus?.data.hasAssignedResources;
  const { data = [], isLoading: istCustomizedAlertsLoading } = useGetCustomizedAlerts();
  const isLoading = isResourcesAssignmentStatusLoading || istCustomizedAlertsLoading;

  const patchCustomizedAlertStatusMutation = usePatchCustomizedAlertStatus();
  const deleteCustomizedAlertMutation = useDeleteCustomizedAlert();

  const [
    isRemoveDialogOpen,
    { handleOpen: handleOpenRemoveDialog, handleClose: handleCloseRemoveDialog },
  ] = useToggle();

  const [selectedIds, setSelectedIds] = useState<CustomizedAlerts['id'][]>([]);

  const router = useRouter();
  const handleGoCreateAlert = (mode: CreateAlert) => {
    router.push(BUDGET_PATHS.budgetEditAlert.pathname.replace('[alert_id]', mode));
  };

  const handleChangeStatus = (alertId: CustomizedAlerts['id'], status: boolean) => {
    if (alertId === null) return;
    patchCustomizedAlertStatusMutation.mutateAsync({ alertId, status });
  };

  const handleOpenSingleRemoveDialog = (alertId: CustomizedAlerts['id']) => {
    setSelectedIds([alertId]);
    handleOpenRemoveDialog();
  };
  const handleConfirmRemove = async () => {
    handleCloseRemoveDialog();
    const ids = selectedIds.join(',');
    try {
      await deleteCustomizedAlertMutation.mutateAsync({ ids });
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to delete budget:', error);
    }
  };

  return (
    <Stack spacing={5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Customized Budget</Typography>
        <UpdateAt />
      </Stack>
      <Typography color="text.secondary">
        Gain greater control over your cloud costs with customized budget. Create, view, activate,
        deactivate, and delete individual budgets with ease.
        <br />
        For added efficiency, select multiple budgets and delete them in bulk.
      </Typography>
      <Stack direction="row" spacing={4} sx={{ alignSelf: 'flex-end' }}>
        {!!selectedIds.length && (
          <Button
            variant="outlined"
            startIcon={<Icon name="delete" />}
            onClick={handleOpenRemoveDialog}
            disabled={isResourcesAssignmentStatusLoading || !hasAssignedResources}
          >
            Remove Budget
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<Icon name="library_add" />}
          onClick={() => handleGoCreateAlert(CreateAlert.BATCH)}
          disabled={isResourcesAssignmentStatusLoading || !hasAssignedResources}
        >
          Batch Create
        </Button>
        <Button
          startIcon={<Icon name="add" />}
          onClick={() => handleGoCreateAlert(CreateAlert.SINGLE)}
          disabled={isResourcesAssignmentStatusLoading || !hasAssignedResources}
        >
          Create Budget
        </Button>
      </Stack>
      <Paper sx={{ p: 8 }}>
        {isLoading ? (
          <TableSkeleton />
        ) : hasAssignedResources ? (
          data.length === 0 ? (
            <Stack sx={{ height: 400 }}>
              <EmptyState
                type="emptyList"
                title="No Budget Yet"
                desc={`Get your finances in order!\nCreate your first budget and explore the power of flexible alerts and rules to help you stay on track.`}
              />
            </Stack>
          ) : (
            <OverviewTable
              data={data}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onChangeStatus={handleChangeStatus}
              onDelete={handleOpenSingleRemoveDialog}
            />
          )
        ) : (
          <Stack sx={{ height: 400 }}>
            <NoAuthorization
              adminDesc={CUSTOMIZED_EMPTY_CONTENT.customizedBudgetNoAuthAdmin.desc}
              nonAdminDesc={CUSTOMIZED_EMPTY_CONTENT.customizedBudgetNoAuthNonAdmin.desc}
            />
          </Stack>
        )}
      </Paper>
      <RemoveDialog
        open={isRemoveDialogOpen}
        count={selectedIds.length}
        onClose={handleCloseRemoveDialog}
        onConFirm={handleConfirmRemove}
      >
        <Stack component="ul" sx={{ m: 0, pl: 6 }}>
          {data
            .filter((item) => selectedIds.includes(item.id))
            .map((item) => (
              <Typography key={item.id} component="li" color="primary.main">
                {item.name}
              </Typography>
            ))}
        </Stack>
      </RemoveDialog>
    </Stack>
  );
};

export default CustomizedBudgetPage;
