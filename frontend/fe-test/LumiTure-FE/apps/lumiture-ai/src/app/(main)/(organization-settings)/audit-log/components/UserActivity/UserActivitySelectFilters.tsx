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

import { useGetUserActivityFilters, type DomainType } from '@hooks-api';

import { DOMAIN_TYPE_OPTIONS } from '../../constants/auditLog';
import { useUserActivityStore } from '../../hooks/useUserActivityStore';

const LABELS = {
  userPlaceholder: 'Select Email',
  domainTypePlaceholder: 'Select Type',
  countryPlaceholder: 'Select Country',
};

export function UserActivitySelectFilters() {
  const { selectedUsers, setSelectedUsers, filters, setFilters } = useUserActivityStore();
  const { data: filtersData } = useGetUserActivityFilters();

  const [tempUsers, setTempUsers] = useState<SelectedData>(selectedUsers);
  const [tempDomainTypes, setTempDomainTypes] = useState<DomainType[]>(filters.domainTypes);
  const [tempCountries, setTempCountries] = useState<string[]>(filters.countries);

  useEffect(() => {
    setTempUsers(selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    setTempDomainTypes(filters.domainTypes);
  }, [filters.domainTypes]);

  useEffect(() => {
    setTempCountries(filters.countries);
  }, [filters.countries]);

  const handleUsersChange = (newSelected: SelectedData) => {
    setTempUsers(newSelected);
  };

  const handleUsersClose = () => {
    setSelectedUsers(tempUsers);
  };

  const handleDomainTypesChange = ({ value }: MultiSelectChangeEvent<DomainType>) => {
    setTempDomainTypes(value);
  };

  const handleDomainTypesClose = () => {
    setFilters({ domainTypes: tempDomainTypes });
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

  const availableDomainTypes = filtersData?.data.domainTypes ?? [];
  const domainTypeOptions = DOMAIN_TYPE_OPTIONS.filter((option) =>
    availableDomainTypes.includes(option.id)
  );

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
        selectPlaceholder={LABELS.userPlaceholder}
        wrapperSx={{ width: '140px' }}
      />
      <MultiSelect<DomainType>
        configKey="domainTypes"
        options={domainTypeOptions}
        value={tempDomainTypes}
        onChange={handleDomainTypesChange}
        handleClose={handleDomainTypesClose}
        selectPlaceholder={LABELS.domainTypePlaceholder}
        wrapperSx={{ width: '140px' }}
      />
      <MultiSelect
        configKey="countries"
        options={countryOptions}
        value={tempCountries}
        onChange={handleCountriesChange}
        handleClose={handleCountriesClose}
        selectPlaceholder={LABELS.countryPlaceholder}
        wrapperSx={{ width: '140px' }}
      />
    </HStack>
  );
}
