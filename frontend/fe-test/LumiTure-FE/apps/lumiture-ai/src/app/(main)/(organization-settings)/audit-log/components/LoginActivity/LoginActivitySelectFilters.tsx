'use client';

import { useEffect, useState } from 'react';

import {
  GroupedMultiSelect,
  HStack,
  MultiSelect,
  type MultiSelectChangeEvent,
  type Option,
  type SelectedData,
} from '@lumiture-ui';

import { useGetLoginActivityFilters, type Provider } from '@hooks-api';

import { PROVIDER_OPTIONS } from '../../constants/auditLog';
import { useLoginActivityStore } from '../../hooks/useLoginActivityStore';

export const SELECT_FILTER_LABELS = {
  userPlaceholder: 'Select Email',
  providerPlaceholder: 'Select Type',
  countryPlaceholder: 'Select Country',
};

export function LoginActivitySelectFilters() {
  const { selectedUsers, setSelectedUsers, filters, setFilters } = useLoginActivityStore();
  const { data: filtersData } = useGetLoginActivityFilters();

  const [tempUsers, setTempUsers] = useState<SelectedData>(selectedUsers);
  const [tempProviders, setTempProviders] = useState<Provider[]>(filters.providers);
  const [tempCountries, setTempCountries] = useState<string[]>(filters.countries);

  useEffect(() => {
    setTempUsers(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    setTempProviders(filters.providers);
  }, [filters.providers]);

  useEffect(() => {
    setTempCountries(filters.countries);
  }, [filters.countries]);

  const handleUsersChange = (newSelected: SelectedData) => {
    setTempUsers(newSelected);
  };

  const handleUsersClose = () => {
    setSelectedUsers(tempUsers);
  };

  const handleProvidersChange = ({ value }: MultiSelectChangeEvent<Provider>) => {
    setTempProviders(value);
  };

  const handleProvidersClose = () => {
    setFilters({ providers: tempProviders });
  };

  const handleCountriesChange = ({ value }: MultiSelectChangeEvent) => {
    setTempCountries(value);
  };

  const handleCountriesClose = () => {
    setFilters({ countries: tempCountries });
  };

  const usersGroupData = (filtersData?.data.users ?? []).map((group) => ({
    key: group.key,
    displayKey: group.key.charAt(0).toUpperCase() + group.key.slice(1),
    values: group.values.map((email) => ({ id: email, name: email })),
  }));

  const countryOptions: Option[] = (filtersData?.data.countries ?? []).map((country) => ({
    id: country,
    name: country,
  }));

  return (
    <HStack gap={2}>
      <GroupedMultiSelect
        data={usersGroupData}
        value={tempUsers}
        onChange={handleUsersChange}
        handleClose={handleUsersClose}
        selectPlaceholder={SELECT_FILTER_LABELS.userPlaceholder}
        wrapperSx={{ width: '140px' }}
      />
      <MultiSelect<Provider>
        configKey="providers"
        options={PROVIDER_OPTIONS}
        value={tempProviders}
        onChange={handleProvidersChange}
        handleClose={handleProvidersClose}
        selectPlaceholder={SELECT_FILTER_LABELS.providerPlaceholder}
        wrapperSx={{ width: '140px' }}
      />
      <MultiSelect
        configKey="countries"
        options={countryOptions}
        value={tempCountries}
        onChange={handleCountriesChange}
        handleClose={handleCountriesClose}
        selectPlaceholder={SELECT_FILTER_LABELS.countryPlaceholder}
        wrapperSx={{ width: '140px' }}
      />
    </HStack>
  );
}
