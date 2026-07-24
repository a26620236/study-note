'use client';

import { InputAdornment, Paper, Typography } from '@mui/material';

import {
  Button,
  DatePickerWithQuickRange,
  GroupedMultiSelect,
  HStack,
  Icon,
  Input,
  MultiSelect,
  ToggleGroup,
  VStack,
} from '@lumiture-ui';

import TableSkeleton from '@components/table/TableSkeleton';

import { SEARCH_LABELS } from '../LoginActivity/LoginActivitySearch';
import { SELECT_FILTER_LABELS } from '../LoginActivity/LoginActivitySelectFilters';
import { AuditView, LABELS, toggleButtons } from './AuditLog';

export function AuditLogSkeleton() {
  return (
    <VStack gap={6}>
      <VStack gap={0.5}>
        <Typography variant="h4">{LABELS.title}</Typography>
        <Typography variant="bodyMedium" color="text.secondary">
          {LABELS.subtitle}
        </Typography>
      </VStack>
      <HStack justifyContent="space-between" alignItems="center">
        <ToggleGroup
          toggleGroupProps={{
            value: AuditView.LoginActivity,
            exclusive: true,
            disabled: true,
          }}
          toggleButtons={toggleButtons}
        />
        <Button variant="contained" startIcon={<Icon name="download" />} disabled={true}>
          {LABELS.exportCsv}
        </Button>
      </HStack>
      <Paper sx={{ padding: 6 }}>
        <VStack gap={4}>
          <HStack justifyContent="space-between">
            <HStack gap={2}>
              <HStack gap={2}>
                <GroupedMultiSelect
                  data={[]}
                  value={[]}
                  selectPlaceholder={SELECT_FILTER_LABELS.userPlaceholder}
                  wrapperSx={{ width: '140px' }}
                />
                <MultiSelect
                  configKey="providers"
                  options={[]}
                  value={[]}
                  selectPlaceholder={SELECT_FILTER_LABELS.providerPlaceholder}
                  wrapperSx={{ width: '140px' }}
                />
                <MultiSelect
                  configKey="countries"
                  options={[]}
                  value={[]}
                  selectPlaceholder={SELECT_FILTER_LABELS.countryPlaceholder}
                  wrapperSx={{ width: '140px' }}
                />
              </HStack>
              <DatePickerWithQuickRange
                disabled={true}
                selectsRange={true}
                startDate={new Date()}
                endDate={new Date()}
              />
            </HStack>
            <Input
              placeholder={SEARCH_LABELS.searchPlaceholder}
              disabled={true}
              slotProps={{
                input: {
                  sx: { width: '240px' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon name="search" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </HStack>
          <TableSkeleton rows={5} columns={4} />
        </VStack>
      </Paper>
    </VStack>
  );
}
