import { Typography } from '@mui/material';

import { HStack, Icon, VStack } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';

import { Currency } from '@constants';
import type { RecommendList } from '@hooks-api';

import { RecommendedInstanceCostsSkeleton } from './RecommendedInstanceCostsSkeleton';

interface RecommendedInstanceCostsProps {
  isLoading: boolean;
  recommendList?: RecommendList[];
  hourlyUsage: number | '';
}

export function RecommendedInstanceCosts({
  isLoading,
  recommendList,
  hourlyUsage,
}: RecommendedInstanceCostsProps) {
  const currency = Currency.USD;

  const formattedMonthlyCost = (hourlyCost: number) => {
    if (hourlyUsage === '') {
      return '--';
    }
    const monthlyCost = (hourlyCost * hourlyUsage).toFixed(2);
    return `${currency} ${monthlyCost} / month`;
  };

  const formattedHourlyCost = (hourlyCost: number) => `$${hourlyCost.toFixed(3)} / hour`;

  return (
    <>
      {isLoading ? (
        <RecommendedInstanceCostsSkeleton />
      ) : (
        <HStack gap={2} justifyContent="space-between">
          {recommendList?.map((item, index) => {
            const isFirst = index === 0;
            return (
              <VStack
                key={item.type}
                p="8px 16px"
                borderRadius={2}
                border={1}
                borderColor={isFirst ? basicColor.secondary.green[70] : theme.palette.gray.border}
                bgcolor={isFirst ? basicColor.secondary.green[10] : theme.palette.white.main}
                alignItems="center"
                flexGrow={1}
              >
                <HStack gap={1} alignItems="center">
                  {isFirst && (
                    <Icon
                      name="thumb_up"
                      sx={{ color: theme.palette.success.main, fontSize: 16 }}
                    />
                  )}
                  <Typography variant="bodyBold">{item.type}</Typography>
                </HStack>
                <Typography variant="caption">{item.spec}</Typography>
                <Typography variant="bodyBold">{formattedMonthlyCost(item.hourlyCost)}</Typography>
                <Typography variant="caption">{formattedHourlyCost(item.hourlyCost)}</Typography>
              </VStack>
            );
          })}
        </HStack>
      )}
    </>
  );
}
