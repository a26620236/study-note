import { Paper, Tooltip, Typography } from '@mui/material';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { nFormatAbbreviation } from '@shared/utils';

import { useGetFiscalReportQuery } from '../../hooks/useGetFiscalReportQuery';
import { getEndPeriod } from '../../utils/getEndPeriod';
import { CloudCostPerCustomerMonthlyTrendChart } from './CloudCostPerCustomerMonthlyTrendChart';

const LABELS = {
  title: 'Cloud Cost Per Customer',
  activeCustomers: 'Active Customers',
  description: `<strong>Cloud Cost per Customer</strong> is calculated as: <br/><u><em>Monthly cloud cost ÷ Monthly active customer count</em></u>`,
  noData: 'No Data',
};

export function CloudCostPerCustomerSection() {
  const { data: fiscalReport } = useGetFiscalReportQuery();

  const { cloudCostPerCustomer, period, currency } = fiscalReport?.data ?? {};
  const { activeCustomers, value, trendChart } = cloudCostPerCustomer ?? {};

  return (
    <Paper sx={{ padding: '24px', flex: 1 }}>
      <VStack gap={2}>
        <Typography variant="h5">{LABELS.title}</Typography>
        <Typography variant="body2" color="text.hint" sx={{ fontStyle: 'italic' }}>
          {getEndPeriod(period?.end)}
        </Typography>
      </VStack>
      <HStack flexWrap="nowrap" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        {value ? (
          <Tooltip title={<Markdown>{LABELS.description}</Markdown>}>
            <div>
              <HStack sx={{ flexWrap: 'nowrap', alignItems: 'baseline', gap: 2 }}>
                <Typography variant="h2">
                  {nFormatAbbreviation({ num: value })}
                </Typography>
                <Typography variant="captionBold">{currency}</Typography>
              </HStack>
            </div>
          </Tooltip>
        ) : (
          <Typography variant="h2" color="text.hint">
            {LABELS.noData}
          </Typography>
        )}
        <VStack sx={{ width: 'fit-content' }}>
          <Typography variant="captionBold" color="text.secondary" noWrap>
            {LABELS.activeCustomers}
          </Typography>
          {activeCustomers ? (
            <Typography variant="h3">
              {activeCustomers < 1000
                ? activeCustomers
                : nFormatAbbreviation({ num: activeCustomers })}
            </Typography>
          ) : (
            <Typography variant="h3" color="text.hint">
              {LABELS.noData}
            </Typography>
          )}
        </VStack>
      </HStack>
      <CloudCostPerCustomerMonthlyTrendChart data={trendChart} />
    </Paper>
  );
}
