import type { ReactNode } from 'react';

import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useWatch } from 'react-hook-form';

import { FORM_ID } from '@app/(main)/budget/customized/components/constants';
import usePeriodInfo from '@app/(main)/budget/customized/components/MonitoringPeriodForm/usePeriodInfo';
import { MonitoringPeriod } from '@app/(main)/budget/customized/components/types';

const HeighLightDate = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="captionBold" sx={{ textDecoration: 'underline' }}>
    {children}
  </Typography>
);

const PeriodInfo = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const monitoringPeriod = useWatch({ name: FORM_ID.PERIOD }) as MonitoringPeriod;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const startDate = useWatch({ name: FORM_ID.START_DATE }) as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- legacy code
  const endDate = useWatch({ name: FORM_ID.END_DATE }) as string;

  const { isAfterLastUniversalDay, isLeapYearDay } = usePeriodInfo();

  const periodInfoSchema: Record<MonitoringPeriod, ReactNode> = {
    [MonitoringPeriod.DAILY]: (
      <Typography variant="caption" color="text.secondary">
        This budget will be monitored daily until you manually disable the alerts.
      </Typography>
    ),
    [MonitoringPeriod.MONTHLY]: (
      <>
        <Typography variant="caption" color="text.secondary">
          {`This means your first budget period will be from `}
          <HeighLightDate>{`${format(new Date(startDate), 'd MMM.')} to ${format(new Date(endDate), 'd MMM.')}`}</HeighLightDate>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {`The recurring budget's start date is the `}
          <HeighLightDate>{format(new Date(startDate), 'do')}</HeighLightDate>
          {` of each month.`}
        </Typography>
        {isAfterLastUniversalDay && (
          <FormHelperText error sx={{ mt: 0 }}>
            *Please note: Invalid start dates will shift to the next day. (e.g., 30 Feb.)
          </FormHelperText>
        )}
      </>
    ),
    [MonitoringPeriod.YEARLY]: (
      <>
        <Typography variant="caption" color="text.secondary">
          {`This means your first budget period will be from `}
          <HeighLightDate>{`${format(new Date(startDate), 'd MMM. yyyy')} to ${format(new Date(endDate), 'd MMM. yyyy')}.`}</HeighLightDate>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {`The recurring budget's start date is the `}
          <HeighLightDate>{format(new Date(startDate), 'd MMM.')}</HeighLightDate>
          {` of each year.`}
        </Typography>
        {isLeapYearDay && (
          <FormHelperText error sx={{ mt: 0 }}>
            * Start date in non-leap years will be on 1 Mar.
          </FormHelperText>
        )}
      </>
    ),
    [MonitoringPeriod.CUSTOMIZED]: (
      <Typography variant="caption" color="text.secondary">
        This budget will be deactivated and no longer monitored after the end date.
      </Typography>
    ),
  };

  return <Stack sx={{ mt: 2 }}>{periodInfoSchema[monitoringPeriod]}</Stack>;
};

export default PeriodInfo;
