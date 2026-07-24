'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Chip, Typography } from '@mui/material';
import { getMonth } from 'date-fns';

import { DropdownButton, HStack, Icon, type DropdownButtonItem } from '@lumiture-ui';
import { basicColor, theme } from '@lumiture-ui/theme';

import { DASHBOARD_PATHS } from '@constants';
import { useGetFiscalMetricsSettings } from '@hooks-api';

import { formatFiscalMonth } from '../utils/formatFiscalMonth';

const DEFAULT_FISCAL_START_MONTH = 1;

const getFiscalPeriodLabel = (year: number, startMonth: number) => {
  const start = new Date(year, startMonth, 1);
  const end = new Date(year + 1, startMonth - 1, 1);
  return `${formatFiscalMonth(start)} - ${formatFiscalMonth(end)}`;
};

interface FiscalYearLabelProps {
  year: number;
  startMonth: number;
}

function FiscalYearLabel({ year, startMonth }: FiscalYearLabelProps) {
  return (
    <HStack alignItems="center" gap={0.5} minWidth={0}>
      <Typography variant="body1" color="text.primary">
        {`FY ${year}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {`・${getFiscalPeriodLabel(year, startMonth)}`}
      </Typography>
    </HStack>
  );
}

function IncompleteChip() {
  return (
    <Chip
      label="Incomplete"
      sx={{
        borderRadius: '4px',
        padding: '0 8px',
        height: 'fit-content',
        color: theme.palette.white.main,
        '& .MuiChip-label': {
          padding: 0,
        },
        backgroundColor: basicColor.secondary.turquoiseBlue[70],
      }}
    />
  );
}

interface FiscalYearSelectorButtonProps {
  year: number;
  completed: boolean;
  startMonth: number;
  isOpen: boolean;
}

function FiscalYearSelectorButton({
  year,
  completed,
  startMonth,
  isOpen,
}: FiscalYearSelectorButtonProps) {
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
        bgcolor: 'white.main',
      }}
    >
      <Icon name="event" sx={{ color: 'text.secondary' }} />
      <FiscalYearLabel year={year} startMonth={startMonth} />
      <HStack alignItems="center" flexShrink={0} sx={{ ml: 'auto' }}>
        {!completed && <IncompleteChip />}
        <Icon
          name={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
          sx={{ color: 'text.secondary' }}
        />
      </HStack>
    </HStack>
  );
}

export function FiscalYearSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiscalYearParam = searchParams.get('year');

  const [isOpen, setIsOpen] = useState(false);

  const { data } = useGetFiscalMetricsSettings(fiscalYearParam);
  const { year: yearSettings, period } = data?.data ?? {};

  const fiscalStartMonth = period?.start
    ? getMonth(new Date(period.start))
    : DEFAULT_FISCAL_START_MONTH;
  const selectedYear = fiscalYearParam ? Number(fiscalYearParam) : undefined;

  const yearOptions = useMemo(() => {
    const configured = yearSettings?.configured ?? [];
    const unconfigured = yearSettings?.unconfigured ?? [];
    const years = Array.from(new Set([...configured, ...unconfigured])).sort(
      (first, second) => second - first
    );
    return years.map((year) => ({ year, completed: configured.includes(year) }));
  }, [yearSettings]);

  if (yearOptions.length === 0) return null;

  const selectedOption =
    yearOptions.find((option) => option.year === selectedYear) ?? yearOptions[0];

  const handleSelectYear = (year: number) => {
    if (year === selectedOption.year) return;
    router.push(`${DASHBOARD_PATHS.executiveInsightsSettings.pathname}?year=${year}`);
  };

  const dropdownItems: DropdownButtonItem<number>[] = yearOptions.map(({ year, completed }) => ({
    value: year,
    label: <FiscalYearLabel year={year} startMonth={fiscalStartMonth} />,
    selected: year === selectedOption.year,
    onClick: handleSelectYear,
    tags: completed ? [] : [<IncompleteChip key="incomplete" />],
  }));

  return (
    <DropdownButton
      isOpen={isOpen}
      handleOpen={() => setIsOpen(true)}
      handleClose={() => setIsOpen(false)}
      placement="bottom-start"
      button={
        <FiscalYearSelectorButton
          year={selectedOption.year}
          completed={selectedOption.completed}
          startMonth={fiscalStartMonth}
          isOpen={isOpen}
        />
      }
      list={dropdownItems}
      popperProps={{ sx: { width: 342 } }}
    />
  );
}
