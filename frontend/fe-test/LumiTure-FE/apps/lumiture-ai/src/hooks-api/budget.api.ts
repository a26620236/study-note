'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { keyBy } from 'lodash-es';

import { popErrorToast, popSuccessToast } from '@shared/utils';

import {
  formatCustomBudgetForm,
  formatGetCustomBudgetDetailsRes,
} from '@app/(main)/budget/customized/components/helpers';
import type {
  CustomBudgetBatchForm,
  CustomBudgetForm,
} from '@app/(main)/budget/customized/components/types';
import { BUDGET_PATHS } from '@constants';
import { api, type ApiError } from '@utils';

import type {
  CustomizedAlerts,
  GeneralAlertsPayload,
  GetCustomBudgetAlertOrgUsersRes,
  GetCustomBudgetDetailsRes,
  GetCustomizedAlertsRes,
} from './budget.type';

const PATH = '/budget';

const getCustomizedAlertsQueryKey = [PATH, 'customized_alerts'];

export const usePostGeneralAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'post', 'general_alerts'],
    mutationFn: async (requestBody: GeneralAlertsPayload) => {
      const data = await api.post(`${PATH}/general_alerts/`, {
        requestBody,
      });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({ description: 'Alert set complete.' });

      queryClient.invalidateQueries({ queryKey: [PATH, 'general_alerts'] });
    },
    onError: () => {
      popErrorToast({ description: 'Alert set failed. Please try again later.' });
    },
  });
};

export const useGetCustomizedAlerts = () =>
  useQuery<GetCustomizedAlertsRes, ApiError>({
    queryKey: getCustomizedAlertsQueryKey,
    queryFn: async () => {
      const res = await api.get<GetCustomizedAlertsRes>(`${PATH}/customized_alerts`);

      return res;
    },
  });

export const useGetCustomBudgetAlertDetails = ({
  alertId,
  isCreateMode,
}: {
  alertId: string;
  isCreateMode: boolean;
}) =>
  useQuery<CustomBudgetForm, ApiError>({
    queryKey: [PATH, 'customized_alerts', alertId],
    queryFn: async () => {
      const res = await api.get<GetCustomBudgetDetailsRes>(
        `${PATH}/customized_alerts/${alertId}`,
        {}
      );
      return formatGetCustomBudgetDetailsRes(res);
    },
    enabled: !isCreateMode,
  });

export const useGetCustomBudgetAlertOrgUsers = () =>
  useQuery<GetCustomBudgetAlertOrgUsersRes, ApiError>({
    queryKey: [PATH, 'customized_alerts/org_users'],
    queryFn: async () => {
      const res = await api.get<GetCustomBudgetAlertOrgUsersRes>(
        `${PATH}/customized_alerts/org_users`
      );

      return res;
    },
  });

// single create
export const usePostCustomizedAlert = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'post', 'customized_alerts'],
    mutationFn: async (requestBody: CustomBudgetForm) => {
      const data = await api.post(`${PATH}/customized_alerts/`, {
        requestBody: formatCustomBudgetForm(requestBody),
      });
      return data;
    },
    onMutate: async (requestBody) => {
      await queryClient.cancelQueries({ queryKey: getCustomizedAlertsQueryKey });

      const previousData = queryClient.getQueryData<GetCustomizedAlertsRes>(
        getCustomizedAlertsQueryKey
      );

      queryClient.setQueryData<GetCustomizedAlertsRes>(getCustomizedAlertsQueryKey, (oldData) =>
        oldData
          ? [
              ...oldData,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/consistent-type-assertions -- legacy code
              {
                ...formatCustomBudgetForm(requestBody),
                id: null,
                resourcesAmount: 0,
                spending: 0,
                isOptimistic: true,
              } as CustomizedAlerts,
            ]
          : []
      );

      return { previousData };
    },
    onError: (_err, variables, context) => {
      popErrorToast({ description: 'Budget created failed. Please try again later.' });
      if (context?.previousData) {
        queryClient.setQueryData(getCustomizedAlertsQueryKey, context.previousData);
      }
    },
    onSuccess: () => {
      popSuccessToast({ description: 'Budget created successfully.' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getCustomizedAlertsQueryKey });
      router.push(BUDGET_PATHS.customizedBudget.pathname);
    },
  });
};

// batch create
export const usePostCustomizedAlertBatch = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'post', 'customized_alerts_batch'],
    mutationFn: async (requestBody: CustomBudgetBatchForm) => {
      const data = await api.post(`${PATH}/customized_alerts/batch/`, {
        requestBody: formatCustomBudgetForm(requestBody),
      });
      return data;
    },
    onMutate: async (requestBody) => {
      await queryClient.cancelQueries({ queryKey: getCustomizedAlertsQueryKey });

      const previousData = queryClient.getQueryData<GetCustomizedAlertsRes>(
        getCustomizedAlertsQueryKey
      );

      const newestItems = requestBody.alerts.values.map(
        (item) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/consistent-type-assertions -- legacy code
          ({
            ...formatCustomBudgetForm(requestBody),
            name: `${requestBody.name}_${item.name}`,
            id: null,
            resourcesAmount: 0,
            spending: 0,
            isOptimistic: true, // 使用樂觀更新機制，先顯示建立後的內容，避免等待重新 GET 資料時間太久
          }) as CustomizedAlerts
      );

      queryClient.setQueryData<GetCustomizedAlertsRes>(getCustomizedAlertsQueryKey, (oldData) =>
        oldData ? [...oldData, ...newestItems] : []
      );

      return { previousData };
    },
    onError: (_err, variables, context) => {
      popErrorToast({ description: 'Budget created failed. Please try again later.' });
      if (context?.previousData) {
        queryClient.setQueryData(getCustomizedAlertsQueryKey, context.previousData);
      }
    },
    onSuccess: () => {
      popSuccessToast({ description: 'Budget created successfully.' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getCustomizedAlertsQueryKey });
      router.push(BUDGET_PATHS.customizedBudget.pathname);
    },
  });
};

// single update
export const usePutCustomizedAlert = ({ alertId }: { alertId: CustomizedAlerts['id'] }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'put', 'customized_alerts'],
    mutationFn: async (requestBody: CustomBudgetForm) => {
      const data = await api.put(`${PATH}/customized_alerts/${alertId}`, {
        requestBody: formatCustomBudgetForm(requestBody),
      });
      return data;
    },
    onSuccess: () => {
      popSuccessToast({ description: 'Budget updated successfully.' });

      queryClient.invalidateQueries({ queryKey: [PATH, 'customized_alerts', alertId] });
      router.push(BUDGET_PATHS.customizedBudget.pathname);
    },
    onError: () => {
      popErrorToast({ description: 'Unable to update budget. Please try again later.' });
    },
  });
};

// single update status
export const usePatchCustomizedAlertStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'patch', 'customized_alert_status'],
    mutationFn: async ({
      alertId,
      status,
    }: {
      alertId: CustomizedAlerts['id'];
      status: boolean;
    }) => {
      const data = await api.patch(`${PATH}/customized_alerts/${alertId}`, {
        requestBody: { status },
      });
      return data;
    },
    onMutate: async ({ alertId, status }) => {
      await queryClient.cancelQueries({ queryKey: getCustomizedAlertsQueryKey });

      const previousData = queryClient.getQueryData<GetCustomizedAlertsRes>(
        getCustomizedAlertsQueryKey
      );

      queryClient.setQueryData<GetCustomizedAlertsRes>(getCustomizedAlertsQueryKey, (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((alert) => {
          if (alert.id === alertId) {
            return { ...alert, status };
          } else {
            return alert;
          }
        });
      });

      return { previousData };
    },
    onError: (_err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(getCustomizedAlertsQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getCustomizedAlertsQueryKey });
    },
  });
};

export const useDeleteCustomizedAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PATH, 'delete', 'customized_alert'],
    mutationFn: async ({ ids }: { ids: string }) => {
      const data = await api.delete(`${PATH}/customized_alerts`, {
        params: { ids },
      });
      return data;
    },
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey: getCustomizedAlertsQueryKey });

      const deletedIdsMap = keyBy(ids.split(','));

      const previousTodos = queryClient.getQueryData<GetCustomizedAlertsRes>(
        getCustomizedAlertsQueryKey
      );

      queryClient.setQueryData<GetCustomizedAlertsRes>(getCustomizedAlertsQueryKey, (oldData) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        oldData ? oldData.filter((alert) => !deletedIdsMap[alert.id as string]) : []
      );

      return { previousTodos };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(getCustomizedAlertsQueryKey, context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getCustomizedAlertsQueryKey });
    },
  });
};
