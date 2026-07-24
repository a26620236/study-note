import { getDate } from 'date-fns';
import { useWatch } from 'react-hook-form';

import {
  FORM_ID,
  LAST_UNIVERSAL_DAY,
  LEAP_YEAR_DAY,
} from '@app/(main)/budget/customized/components/constants';
import { MonitoringPeriod } from '@app/(main)/budget/customized/components/types';

const usePeriodInfo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const monitoringPeriod = useWatch({ name: FORM_ID.PERIOD }) as MonitoringPeriod;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const startDate = useWatch({ name: FORM_ID.START_DATE }) as string;

  const isDaily = monitoringPeriod === MonitoringPeriod.DAILY;
  const isMonthly = monitoringPeriod === MonitoringPeriod.MONTHLY;
  const isYearly = monitoringPeriod === MonitoringPeriod.YEARLY;
  const isCustomized = monitoringPeriod === MonitoringPeriod.CUSTOMIZED;

  const isAfterLastUniversalDay = getDate(new Date(startDate)) > LAST_UNIVERSAL_DAY;
  const isLeapYearDay = getDate(new Date(startDate)) === LEAP_YEAR_DAY;

  return { isDaily, isMonthly, isYearly, isCustomized, isAfterLastUniversalDay, isLeapYearDay };
};

export default usePeriodInfo;
