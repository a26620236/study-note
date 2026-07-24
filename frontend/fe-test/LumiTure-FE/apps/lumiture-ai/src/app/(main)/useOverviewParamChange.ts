import { useRouter, useSearchParams } from 'next/navigation';

import { format, startOfYear } from 'date-fns';

import { OVERVIEW_INIT_PARAMS } from '@app/(main)/components/CostOverview/constants';
import { OVERVIEW_PATHS } from '@constants';
import { OverviewPeriod } from '@hooks-api';

type DateString = `${number}-${number}-${number}`;

const PARAMS_KEY = {
  FREQ: 'freq',
  PERIOD: 'period',
};

interface Params {
  path?: string;
  frequency?: OverviewPeriod;
  period?: DateString;
}

const generateCaptions = (frequency: OverviewPeriod, period: DateString) => {
  const currentYearStart = startOfYear(new Date(period));

  const startMonthCaption = format(currentYearStart, 'MMM. yyyy');
  const endMonthCaption = format(new Date(period), 'MMM. yyyy');

  const monthRangeCaption =
    startMonthCaption === endMonthCaption
      ? startMonthCaption
      : `${startMonthCaption} - ${endMonthCaption}`;

  const periodCaption =
    +frequency === +OverviewPeriod.MONTHLY
      ? format(new Date(period), 'MMM. yyyy')
      : monthRangeCaption;

  return {
    monthRangeCaption,
    periodCaption,
  };
};

const useOverviewParamChange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const frequency = (searchParams.get(PARAMS_KEY.FREQ) ||
    OVERVIEW_INIT_PARAMS.FREQUENCY) as OverviewPeriod;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const period = (searchParams.get(PARAMS_KEY.PERIOD) ||
    format(OVERVIEW_INIT_PARAMS.PERIOD, 'yyyy-MM-dd')) as DateString;

  const { monthRangeCaption, periodCaption } = generateCaptions(frequency, period);

  const handleParamsChange = ({
    path: _path = OVERVIEW_PATHS.overview.pathname,
    frequency: _freq,
    period: _period,
  }: Params = {}) => {
    const params = {
      [PARAMS_KEY.FREQ]: _freq || frequency,
      [PARAMS_KEY.PERIOD]: _period || period,
    };

    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    router.push(`${_path}?${query}`);
  };

  return { frequency, period, periodCaption, monthRangeCaption, handleParamsChange };
};

export default useOverviewParamChange;
