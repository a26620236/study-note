import { useEffect, useState, type ChangeEvent } from 'react';

import { Box, Divider, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

import { HStack, Markdown, VStack } from '@lumiture-ui';
import { Lumiture as LumitureIcon } from '@lumiture-ui/SvgIcon';

import {
  Currency,
  Depth,
  PLATFORM_CONFIG,
  type CurrencyCode,
  type PlatformsValue,
} from '@constants';
import { BudgetCrossCloudValue, Segment, useGetCurrentGroupBudget } from '@hooks-api';

import { PLATFORMS } from '../../constants/budget';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import type { FormBudget } from '../../types/budgetSettings';
import { AnnualBudgetItem } from './AnnualBudgetItem';
import { DisplayConvertedAmount } from './DisplayConvertedAmount';

type BudgetField = 'allocatedBudget' | 'allocatedBudgetExchange';

const EMPTY_DISPLAY = '--';

interface AnnualBudgetItemData {
  platform: PlatformsValue;
  budget: number | null;
  budgetExchange: number | null;
  expectedBudget: FormBudget;
  expectedBudgetExchange: FormBudget;
}

const LABELS = {
  organization: 'Organization',
  currentAnnualBudget: 'Current Annual Budget',
  credits: 'All budgets on this page are based on actual spend, with the **EXCLUSION OF CREDITS**.',
  inputNote:
    '*Please note that this total only presents values that have been entered, and does not include values with no input.',
  annualBudgetTitle: (prefix: string) => `${prefix} Annual Budget`,
};

export const AnnualBudget = () => {
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  const { data: currentGroupBudgetData, refetch: refetchCurrentGroupBudget } =
    useGetCurrentGroupBudget({
      segment: Segment.MONTHLY,
      fiscalYear,
    });
  const currentGroupBudget = currentGroupBudgetData?.data;

  const { data: session } = useSession();
  const depth = session?.user.group?.depth;
  const currency: CurrencyCode | undefined = session?.user.currency;
  const isAdmin = depth === Depth.ADMIN;

  // Owner/Admin/T1 的 Annual Budget 顯示底下 groups 加總；T2 顯示自己加總
  const createBudgetByExchange =
    (isExchange = false) =>
    (currentPlatformVal: PlatformsValue) => {
      if (depth === Depth.T2) {
        return isExchange
          ? currentGroupBudget?.[currentPlatformVal].allocatedBudgetExchange
          : currentGroupBudget?.[currentPlatformVal].allocatedBudget;
      }
      return isExchange
        ? currentGroupBudget?.[currentPlatformVal].annualBudgetExchange
        : currentGroupBudget?.[currentPlatformVal].annualBudget;
    };

  const getBudget = createBudgetByExchange();
  const getBudgetExchange = createBudgetByExchange(true);

  const calcExpectedBudgetValue = (currentPlatformVal: PlatformsValue, field: BudgetField) => {
    // 只有在 T1 層級才顯示預期預算
    if (depth !== Depth.T1) return null;

    // USD 轉換後還是 USD，直接回傳 allocatedBudget
    if (field === 'allocatedBudgetExchange' && currency === Currency.USD) {
      return currentGroupBudget?.[currentPlatformVal].allocatedBudget ?? EMPTY_DISPLAY;
    }
    return currentGroupBudget?.[currentPlatformVal][field] ?? EMPTY_DISPLAY;
  };

  const items: AnnualBudgetItemData[] = PLATFORMS.filter(
    (platform): platform is PlatformsValue => platform !== BudgetCrossCloudValue.Total
  ).map((currentPlatformVal) => {
    const budget = getBudget(currentPlatformVal);
    const budgetExchange = getBudgetExchange(currentPlatformVal) ?? null;

    return {
      platform: currentPlatformVal,
      budget: budget ?? null,
      budgetExchange,
      expectedBudget: calcExpectedBudgetValue(currentPlatformVal, 'allocatedBudget'),
      expectedBudgetExchange: calcExpectedBudgetValue(
        currentPlatformVal,
        'allocatedBudgetExchange'
      ),
    };
  });

  const total = {
    budget: currentGroupBudget?.[BudgetCrossCloudValue.Total].annualBudget ?? null,
    budgetExchange: currentGroupBudget?.[BudgetCrossCloudValue.Total].annualBudgetExchange ?? null,
  };
  const name = isAdmin ? LABELS.organization : (currentGroupBudget?.groupName ?? '');
  const showBudgetExchange = showCurrencySelector && !isEditing;

  // 換幣成功後 session.currency 會更新，重抓 current_group 取得對應幣別的換算金額
  useEffect(() => {
    if (!currency) return;
    refetchCurrentGroupBudget();
  }, [currency, refetchCurrentGroupBudget]);

  const handleCurrencyDisplayChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowCurrencySelector(event.target.checked);
  };

  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <HStack alignItems="center" justifyContent="space-between" flexWrap="nowrap">
          <Typography variant="h4">{LABELS.annualBudgetTitle(name)}</Typography>
        </HStack>
        <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
          <Markdown>{LABELS.credits}</Markdown>
        </Box>
      </VStack>
      <HStack gap={6} flexWrap="nowrap">
        {/* current annual budget */}
        <AnnualBudgetItem
          title={LABELS.currentAnnualBudget}
          budget={total.budget}
          budgetExchange={total.budgetExchange}
          currency={currency}
          showBudgetExchange={showBudgetExchange}
          icon={<LumitureIcon />}
        />
        <Divider orientation="vertical" flexItem />
        {/* platform annual budget */}
        {items.map(({ platform: itemPlatform, ...item }) => {
          const { icon: PlatformIcon, label } = PLATFORM_CONFIG[itemPlatform];

          return (
            <AnnualBudgetItem
              key={itemPlatform}
              icon={<PlatformIcon />}
              title={LABELS.annualBudgetTitle(label)}
              currency={currency}
              showBudgetExchange={showBudgetExchange}
              {...item}
            />
          );
        })}
      </HStack>
      <DisplayConvertedAmount
        showCurrencySelector={showCurrencySelector}
        onChange={handleCurrencyDisplayChange}
      />
      <Typography variant="caption" color="text.hint" sx={{ fontStyle: 'italic' }}>
        {LABELS.inputNote}
      </Typography>
    </VStack>
  );
};
