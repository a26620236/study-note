import type { MouseEvent } from 'react';

import { Tooltip, Typography } from '@mui/material';

import { HStack, Icon, ToggleGroup } from '@lumiture-ui';

import { Segment, useGetCurrentGroupBudget } from '@hooks-api';

import { MonthlyViewMode, VIEW_MODE_OPTIONS } from '../../constants/budget';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import { formatFiscalPeriodLabel } from '../../utils/budgetFormat';

const LABELS = {
  currency: '(USD)',
  monthlyView: 'Monthly View',
  [MonthlyViewMode.Budget]: 'Budget',
  [MonthlyViewMode.Spend]: 'Spend',
  [MonthlyViewMode.Remaining]: 'Remaining',
  editingTooltip: 'Save your budget to unlock Spend / Remaining views',
  // 目前檢視的財年範圍 + 幣別，例：Viewing: FY 2036 · Feb. '36 - Jan. '37 (USD)
  getViewing: (fiscalYear: number, period: string) => `Viewing: FY ${fiscalYear} · ${period} (USD)`,
};

export const MonthlyViewToggle = () => {
  const viewMode = useBudgetSettingsStore((state) => state.viewMode);
  const setViewMode = useBudgetSettingsStore((state) => state.setViewMode);
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const { data } = useGetCurrentGroupBudget({ segment: Segment.MONTHLY, fiscalYear });
  // store 未選時 fallback 後端回傳的當前財年
  const selectedFiscalYear = fiscalYear ?? data?.data.fiscalYear;
  const selectedOption = data?.data.fiscalYearOptions.find(
    (option) => option.fiscalYear === selectedFiscalYear
  );

  const viewingLabel = selectedOption
    ? LABELS.getViewing(selectedOption.fiscalYear, formatFiscalPeriodLabel(selectedOption))
    : LABELS.currency;

  const handleChange = (_event: MouseEvent<HTMLElement>, value: MonthlyViewMode | null) => {
    if (value === null) return;
    setViewMode(value);
  };

  return (
    <HStack justifyContent="space-between" alignItems="center" width="100%" mt={4}>
      <Typography color="text.hint" sx={{ fontStyle: 'italic' }}>
        {viewingLabel}
      </Typography>
      <HStack gap={2} alignItems="center">
        <Typography variant="bodyBold" color="text.secondary">
          {LABELS.monthlyView}
        </Typography>
        {isEditing ? (
          <Tooltip title={LABELS.editingTooltip} placement="top">
            <span>
              <ToggleGroup
                toggleGroupProps={{
                  exclusive: true,
                  size: 'small',
                }}
                toggleButtons={[
                  {
                    key: MonthlyViewMode.Budget,
                    value: MonthlyViewMode.Budget,
                    disabled: true,
                    children: (
                      <HStack gap={1} alignItems="center">
                        <Icon name="lock" sx={{ fontSize: 14 }} />
                        <Typography variant="buttonRegular1">
                          {LABELS[MonthlyViewMode.Budget]}
                        </Typography>
                      </HStack>
                    ),
                  },
                ]}
              />
            </span>
          </Tooltip>
        ) : (
          <ToggleGroup
            toggleGroupProps={{
              exclusive: true,
              size: 'small',
              value: viewMode,
              onChange: handleChange,
            }}
            toggleButtons={VIEW_MODE_OPTIONS.map((mode) => ({
              key: mode,
              value: mode,
              children: LABELS[mode],
            }))}
          />
        )}
      </HStack>
    </HStack>
  );
};
