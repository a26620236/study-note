import { useState, type ChangeEvent, type ReactNode } from 'react';

import { Tooltip, Typography } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

import { HStack, Icon, NumberInput, VStack } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';
import { Insight } from '@lumiture-ui/SvgIcon';

import { useGetRightsizingRecommendDetail, type RecommendationItem } from '@hooks-api';

import { RecommendedInstanceCosts } from './RecommendedInstanceCosts';

const COST_CALCULATOR_LABELS = {
  title: 'Cost Calculator',
  renderInputMonthlyHours: (input: ReactNode) => (
    <>Enter monthly usage to compare instance costs: {input} hours / month</>
  ),
  recommendedInstanceCosts: 'Recommended Instance Costs',
  notice:
    'AI Notice: All figures are based on real-time exchange rates at the time of generation and are for reference only.',
  emptyNotice:
    'Please enter the hours above to get intelligent rightsizing recommendations from LumiTure.ai',
};

interface CostCalculatorProps {
  recId: RecommendationItem['recId'];
}

const DEFAULT_MONTHLY_HOURS = 720;

export function CostCalculator({ recId }: CostCalculatorProps) {
  const { data: recommendDetail, isLoading } = useGetRightsizingRecommendDetail(recId);
  const [inputMonthlyHours, setInputMonthlyHours] = useState<number | ''>(DEFAULT_MONTHLY_HOURS);
  const [debouncedMonthlyHours, setDebouncedMonthlyHours] = useState<number | ''>(
    DEFAULT_MONTHLY_HOURS
  );

  const debouncedSetMonthlyHours = useDebounceCallback(setDebouncedMonthlyHours, 1000);

  const hasValidUsage = debouncedMonthlyHours !== '';

  const handleMonthlyHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (Number(value) > 720) {
      setInputMonthlyHours(720);
      debouncedSetMonthlyHours(720);
      return;
    }
    if (value === '') {
      setInputMonthlyHours('');
      debouncedSetMonthlyHours('');
      return;
    }
    setInputMonthlyHours(Number(value));
    debouncedSetMonthlyHours(Number(value));
  };

  return (
    <VStack p={4} bgcolor={basicColor.achromatic.gray[3]} borderRadius={2.5} mt={4}>
      <VStack gap={2}>
        <Typography variant="h5">{COST_CALCULATOR_LABELS.title}</Typography>
        <Typography variant="body1" component="div">
          <HStack gap={2} alignItems="center">
            {COST_CALCULATOR_LABELS.renderInputMonthlyHours(
              <NumberInput
                value={inputMonthlyHours}
                onChange={handleMonthlyHoursChange}
                sx={{ width: 120 }}
                disabled={isLoading}
              />
            )}
          </HStack>
        </Typography>
      </VStack>
      <VStack gap={2} mt={5}>
        <HStack alignItems="center" gap={2}>
          <Typography variant="h6">{COST_CALCULATOR_LABELS.recommendedInstanceCosts}</Typography>
          <Tooltip title={COST_CALCULATOR_LABELS.notice}>
            <Icon name="info" sx={{ fontSize: 16, color: 'text.hint', cursor: 'pointer' }} />
          </Tooltip>
        </HStack>
        {hasValidUsage ? (
          <RecommendedInstanceCosts
            isLoading={isLoading}
            recommendList={recommendDetail?.data.recommendList}
            hourlyUsage={debouncedMonthlyHours}
          />
        ) : (
          <VStack alignItems="center" justifyContent="center" gap={1}>
            <Insight sx={{ fontSize: 64, color: theme.palette.primary.light30 }} />
            <Typography variant="h6" color="text.secondary">
              {COST_CALCULATOR_LABELS.emptyNotice}
            </Typography>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
