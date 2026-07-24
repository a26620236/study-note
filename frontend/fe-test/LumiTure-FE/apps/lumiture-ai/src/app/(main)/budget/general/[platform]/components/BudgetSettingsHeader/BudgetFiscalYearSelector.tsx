import { useState } from 'react';

import { Typography } from '@mui/material';

import { DropdownButton, HStack, Icon, type DropdownButtonItem } from '@lumiture-ui';

import { Segment, useGetCurrentGroupBudget, type FiscalYearOption } from '@hooks-api';

import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import { formatFiscalPeriodLabel } from '../../utils/budgetFormat';

const SELECTOR_WIDTH = 240;

const LABELS = {
  getFiscalYear: (year: number) => `FY ${year}`,
  getPeriod: (period: string) => `· ${period}`,
};

function BudgetFiscalYearLabel({
  option,
  disabled = false,
}: {
  option: FiscalYearOption;
  disabled?: boolean;
}) {
  return (
    <HStack alignItems="center" gap={1} minWidth={0}>
      <Typography variant="body1" color={disabled ? 'text.hint' : 'text.primary'}>
        {LABELS.getFiscalYear(option.fiscalYear)}
      </Typography>
      <Typography variant="caption" color={disabled ? 'text.hint' : 'text.secondary'} noWrap>
        {LABELS.getPeriod(formatFiscalPeriodLabel(option))}
      </Typography>
    </HStack>
  );
}

interface BudgetFiscalYearSelectorButtonProps {
  option?: FiscalYearOption;
  isOpen: boolean;
  disabled: boolean;
}

function BudgetFiscalYearSelectorButton({
  option,
  isOpen,
  disabled,
}: BudgetFiscalYearSelectorButtonProps) {
  return (
    <HStack
      alignItems="center"
      gap={2}
      sx={{
        px: '8px',
        py: '6px',
        border: '1px solid',
        borderColor: 'gray.border',
        borderRadius: '8px',
        bgcolor: disabled ? 'gray.disableLight' : 'white.main',
      }}
    >
      <Icon name="event" sx={{ color: 'text.secondary' }} />
      {option && <BudgetFiscalYearLabel option={option} disabled={disabled} />}
      <Icon
        name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
        sx={{ ml: 'auto', color: 'text.secondary' }}
      />
    </HStack>
  );
}

export function BudgetFiscalYearSelector() {
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);
  const setFiscalYear = useBudgetSettingsStore((state) => state.setFiscalYear);
  const isEditing = useBudgetSettingsStore((state) => state.isEditing);

  const [isOpen, setIsOpen] = useState(false);

  const { data } = useGetCurrentGroupBudget({ segment: Segment.MONTHLY, fiscalYear });
  const fiscalYearOptions = data?.data.fiscalYearOptions ?? [];

  const selectedFiscalYear = fiscalYear ?? data?.data.fiscalYear;
  const selectedOption = fiscalYearOptions.find(
    (option) => option.fiscalYear === selectedFiscalYear
  );

  if (fiscalYearOptions.length === 0) return null;

  const handleSelectYear = (year: number) => {
    if (year === selectedFiscalYear) return;
    setFiscalYear(year);
  };

  const dropdownItems: DropdownButtonItem<number>[] = fiscalYearOptions.map((option) => ({
    value: option.fiscalYear,
    label: <BudgetFiscalYearLabel option={option} />,
    selected: option.fiscalYear === selectedFiscalYear,
    onClick: handleSelectYear,
  }));

  return (
    <DropdownButton
      isOpen={isOpen}
      handleOpen={() => setIsOpen(true)}
      handleClose={() => setIsOpen(false)}
      placement="bottom-end"
      disabled={isEditing}
      button={
        <BudgetFiscalYearSelectorButton
          option={selectedOption}
          isOpen={isOpen}
          disabled={isEditing}
        />
      }
      list={dropdownItems}
      popperProps={{ sx: { minWidth: SELECTOR_WIDTH } }}
    />
  );
}
