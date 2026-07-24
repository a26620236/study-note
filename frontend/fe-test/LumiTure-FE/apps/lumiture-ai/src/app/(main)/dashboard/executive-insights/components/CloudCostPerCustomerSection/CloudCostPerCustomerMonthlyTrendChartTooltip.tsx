import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { format, getYear } from 'date-fns';

import { nFormatter } from '@shared/utils';

import type { CurrencySymbol } from '@constants';
import type { CloudCostPerCustomerTrendChart } from '@hooks-api';

interface CloudCostPerCustomerMonthlyTrendChartTooltipProps {
  data: CloudCostPerCustomerTrendChart;
  dataIndex: number;
  currencySymbol?: CurrencySymbol;
}

export function CloudCostPerCustomerMonthlyTrendChartTooltip({
  data,
  dataIndex,
  currencySymbol,
}: CloudCostPerCustomerMonthlyTrendChartTooltipProps) {
  const theme = useTheme();
  const month = format(new Date(data.date[dataIndex]), 'MMM.');
  const year = getYear(new Date(data.date[0]));
  const value = nFormatter({
    num: data.values[dataIndex],
    fixed: 2,
    prefix: currencySymbol,
  });

  return (
    <Box>
      <Typography variant="captionBold">{`${month} ${year}: `}</Typography>
      <Typography
        variant="captionBold"
        style={{ fontWeight: 700, color: theme.palette.text.primary }}
      >
        {value}
      </Typography>
    </Box>
  );
}
