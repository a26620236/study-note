import { useQueries, useQuery } from '@tanstack/react-query';
import { produce } from 'immer';

import { PlatformsValue } from '@constants';
import { api, type ApiError } from '@utils';

import type {
  GetCostSavingsReportRes,
  GetDashboardOverviewOrgParams,
  GetDashboardOverviewOrgRes,
  GetPlatformFilterOptionsParams,
  GetPlatformFilterOptionsRes,
  GetPlatformFilterOptionsReturn,
} from './dashboard.type';
import type { DateString } from './dashboard/dashboard.type';

const PATH = '/dashboard';

const normalizeNonNegative = (value: number | null) => {
  if (value === null) return 0;
  return value < 0 ? 0 : value;
};

// overview
export const useGetDashboardOverviewOrg = ({ period }: { period: DateString }) =>
  useQuery<GetDashboardOverviewOrgRes, ApiError>({
    queryKey: [PATH, 'overview', 'organization', period],
    queryFn: async () => {
      const res = await api.get<GetDashboardOverviewOrgRes, GetDashboardOverviewOrgParams>(
        `${PATH}/overview/organization`,
        {
          params: { period },
        }
      );
      return res;
    },
    select: (data) =>
      // return {
      //   ...(data || {}),
      //   threshold: {
      //     warning: data.threshold.warning ?? DEFAULT_THRESHOLD.WARNING,
      //     alert: data.threshold.alert ?? DEFAULT_THRESHOLD.ALERT,
      //   },
      // }

      /**
       * @NOTE
       * API 目前會回傳負值原因是其中包含了 credit
       * 東南亞團隊認為這是 bug 應該由後端修正
       * 目前前端只是暫時處理，先將負值轉為 0 以爭取後端修正其他問題的時間
       */
      produce(data, (draft) => {
        draft.currentMonth.cost = normalizeNonNegative(draft.currentMonth.cost);
        draft.currentYear.cost = normalizeNonNegative(draft.currentYear.cost);
        draft.lastMonth.cost = normalizeNonNegative(draft.lastMonth.cost);
        draft.monthlyAvg.cost = normalizeNonNegative(draft.monthlyAvg.cost);
        draft.threshold = {
          warning: data.threshold.warning,
          alert: data.threshold.alert,
        };

        draft.totalCost.spending = Object.fromEntries(
          Object.entries(draft.totalCost.spending ?? {}).map(([key, value]) => [
            key,
            normalizeNonNegative(value),
          ])
        );
      }),
  });

export const useLegacyGetPlatformFilterOptions = ({
  platforms,
  params,
}: GetPlatformFilterOptionsParams) => {
  const enabled = !!params.start_date && !!params.end_date;

  return useQueries({
    queries: platforms.map((_platform) => ({
      queryKey: [PATH, 'platform_options', _platform, params.start_date, params.end_date],
      enabled,
      queryFn: async () => {
        const formattedParams = {
          ...params,
          start_date: params.start_date ?? '',
          end_date: params.end_date ?? '',
        };

        const res = await api.get<GetPlatformFilterOptionsRes>(
          `${PATH}/analysis/${_platform}/filter_options`,
          { params: formattedParams }
        );

        const returnRes: GetPlatformFilterOptionsReturn = {
          ...res,
          services: res.services.map((_name) => ({ id: _name, name: _name })),
          skus: res.skus.map((_sku) => ({ id: _sku.id, name: _sku.description || _sku.id })),
        };

        if (_platform === PlatformsValue.GCP) {
          returnRes.projects = returnRes.projects?.map((_project) => ({
            ..._project,
            desc: _project.id,
          }));
        }
        return returnRes;
      },
    })),
  });
};

export const useGetCostSavingsReport = () =>
  useQuery<GetCostSavingsReportRes, ApiError>({
    queryKey: [PATH, 'cost_savings', 'report'],
    queryFn: async () => {
      const res = await api.get<GetCostSavingsReportRes>(`${PATH}/cost_savings/report`);
      return res;
    },
  });
