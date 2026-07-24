'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { addMonths } from 'date-fns';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';

import { Button } from '@lumiture-ui';
import { useToggle } from '@shared/hooks';

import GeneralErrorView from '@app/(auth)/components/GeneralErrorView';
import BatchSettings from '@app/(main)/budget/customized/components/BatchSettings';
import CheckSubmitBatchModal from '@app/(main)/budget/customized/components/BatchSettings/CheckSubmitBatchModal';
import BudgetAlertSettings from '@app/(main)/budget/customized/components/BudgetAlertSettings';
import { DEFAULT_THRESHOLD, FORM_ID } from '@app/(main)/budget/customized/components/constants';
import CostCalcRules from '@app/(main)/budget/customized/components/CostCalcRules';
import {
  customBudgetBatchSchema,
  customBudgetSchema,
} from '@app/(main)/budget/customized/components/schema';
import {
  CreateAlert,
  CreateBy,
  MonitoringPeriod,
  type CustomBudgetBatchForm,
  type CustomBudgetForm,
} from '@app/(main)/budget/customized/components/types';
import GoBack from '@components/GoBack';
import { FixedBottomBarWrapper } from '@components/layout/FixedBottomBarWrapper';
import { BUDGET_PATHS } from '@constants';
import { useRouteProtection } from '@hooks';
import {
  useGetCustomBudgetAlertDetails,
  usePostCustomizedAlert,
  usePostCustomizedAlertBatch,
  usePutCustomizedAlert,
} from '@hooks-api';

const baseDefaultValues = {
  [FORM_ID.NAME]: '',
  [FORM_ID.AMOUNT]: undefined,
  [FORM_ID.PERIOD]: MonitoringPeriod.MONTHLY,
  [FORM_ID.START_DATE]: new Date(),
  [FORM_ID.END_DATE]: addMonths(new Date(), 1),
  [FORM_ID.CREDIT]: false,
  [FORM_ID.RECIPIENTS]: [],
  [FORM_ID.RECIPIENTS_INPUT]: '',
  [FORM_ID.STATUS]: true,
  [FORM_ID.THRESHOLDS]: [DEFAULT_THRESHOLD],
};

const defaultValues = {
  ...baseDefaultValues,
  [FORM_ID.RULES]: [],
};

const defaultBatchValues = {
  ...baseDefaultValues,
  [FORM_ID.ALERT]: {
    createdBy: CreateBy.GROUPS,
    values: [],
  },
};

interface AlertDetailsPageProps {
  params: Promise<{
    alert_id: CreateAlert;
  }>;
}

type FormData = CustomBudgetForm | CustomBudgetBatchForm;

const AlertDetailsPage = ({ params }: AlertDetailsPageProps) => {
  const { alert_id: alertId } = use(params);
  const router = useRouter();

  const [
    isOpenBatchCheckModal,
    { handleOpen: handleBatchCheckOpen, handleClose: handleBatchCheckClose },
  ] = useToggle();

  const isBatchMode = alertId === CreateAlert.BATCH;
  const isCreateMode = alertId === CreateAlert.SINGLE || isBatchMode;
  const {
    data,
    isError,
    isSuccess: hasDataLoaded,
    isLoading,
  } = useGetCustomBudgetAlertDetails({
    alertId,
    isCreateMode,
  });

  const postCustomizedAlertMutation = usePostCustomizedAlert();
  const postCustomizedAlertBatch = usePostCustomizedAlertBatch();
  const putCustomizedAlertMutation = usePutCustomizedAlert({ alertId });

  const isSubmitting = [
    postCustomizedAlertMutation,
    postCustomizedAlertBatch,
    putCustomizedAlertMutation,
  ].some((mutation) => mutation.isPending || mutation.isSuccess);

  const formMethods = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: isBatchMode ? defaultBatchValues : (data ?? defaultValues),
    resolver: zodResolver(isBatchMode ? customBudgetBatchSchema : customBudgetSchema),
  });

  const [isBlockRoute, setIsBlockRoute] = useState(false);
  useRouteProtection({
    isBlock: (isCreateMode || hasDataLoaded) && isBlockRoute,
    onCloseCallback: () => {
      setIsBlockRoute(false);
    },
  });

  // single create
  const handleCreateBudget = (data: CustomBudgetForm) => {
    postCustomizedAlertMutation.mutateAsync(data);
  };

  // batch create (modal)
  const handleCreateBatchBudget = () => {
    handleBatchCheckOpen();
  };

  // batch create (confirm)
  const handleConfirmBatchCreate = () => {
    if (isBatchMode) {
      const formData = formMethods.getValues();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      postCustomizedAlertBatch.mutateAsync(formData as CustomBudgetBatchForm);
      handleBatchCheckClose();
    }
  };

  // edit
  const handleEditBudget = (data: CustomBudgetForm) => {
    putCustomizedAlertMutation.mutateAsync(data);
  };

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    if (isSubmitting) return;
    const {
      formState: { errors },
    } = formMethods;

    if (Object.values(errors).some((error) => error)) return;

    setIsBlockRoute(false);

    if (isBatchMode) {
      handleCreateBatchBudget();
    } else if (isCreateMode) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      handleCreateBudget(data as CustomBudgetForm);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
      handleEditBudget(data as CustomBudgetForm);
    }
  };

  const pageSchema = {
    // single
    [CreateAlert.SINGLE]: {
      title: 'Create Customized Budget',
      buttonText: 'Create Budget',
    },
    // batch
    [CreateAlert.BATCH]: {
      title: 'Batch Create Customized Budget',
      buttonText: 'Create Multiple Budgets',
    },
  }[alertId];

  const handleGoBack = () => {
    router.push(BUDGET_PATHS.customizedBudget.pathname);
  };

  useEffect(() => {
    setIsBlockRoute(true);
    if (hasDataLoaded && !isCreateMode) {
      formMethods.reset(data);
    }
  }, [hasDataLoaded, data, formMethods, isCreateMode]);

  return (
    <Stack spacing={5} sx={{ pb: 10 }}>
      <GoBack
        url={BUDGET_PATHS.customizedBudget.pathname}
        content="Customized Budget List"
        sx={{ alignSelf: 'flex-start' }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <Typography variant="h4">{pageSchema?.title || 'Edit Customized Budget'}</Typography>
      {isError ? (
        <Stack sx={{ height: '70vh', alignItems: 'center' }}>
          <GeneralErrorView />
        </Stack>
      ) : (
        <FormProvider {...formMethods}>
          <Stack
            spacing={5}
            component="form"
            noValidate={true}
            onSubmit={formMethods.handleSubmit(handleFormSubmit)}
          >
            {/* form content */}
            <>
              {isBatchMode && <BatchSettings />}
              <BudgetAlertSettings
                isLoading={isLoading}
                isBatchMode={isBatchMode}
                isEditing={hasDataLoaded}
              />
              {!isBatchMode && <CostCalcRules isLoading={isLoading} />}
            </>
            {/* save */}
            <FixedBottomBarWrapper>
              <Button variant="outlined" sx={{ ml: 'auto', mr: 4 }} onClick={handleGoBack}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
                {pageSchema?.buttonText || 'Save'}
              </Button>
            </FixedBottomBarWrapper>
          </Stack>
          <CheckSubmitBatchModal
            isOpen={isOpenBatchCheckModal}
            onClose={handleBatchCheckClose}
            onConfirm={handleConfirmBatchCreate}
          />
        </FormProvider>
      )}
    </Stack>
  );
};

export default AlertDetailsPage;
