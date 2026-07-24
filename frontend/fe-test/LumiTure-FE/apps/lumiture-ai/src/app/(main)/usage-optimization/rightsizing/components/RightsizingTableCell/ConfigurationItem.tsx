'use client';

import { AWSIcon, AzureIcon, GoogleIcon } from '@lumiture-ui/SvgIcon';

import { DoubleLineCell } from '@components/table/DoubleLineCell';
import { PlatformsValue } from '@constants';
import type { RecommendationItem } from '@hooks-api';

import { useRightsizingStore } from '../../hooks/useRightsizingStore';

interface ConfigurationItemProps {
  configurationItem: RecommendationItem['configurationItem'];
}

export function ConfigurationItem({ configurationItem }: ConfigurationItemProps) {
  const { provider, id, name } = configurationItem;

  const { searchText } = useRightsizingStore();

  const PlatformIcon = () => {
    if (provider === PlatformsValue.GCP) {
      return <GoogleIcon sx={{ fontSize: 20, flexShrink: 0 }} />;
    } else if (provider === PlatformsValue.AWS) {
      return <AWSIcon sx={{ fontSize: 20, flexShrink: 0 }} />;
    } else {
      return <AzureIcon sx={{ fontSize: 20, flexShrink: 0 }} />;
    }
  };

  return (
    <DoubleLineCell name={name ?? ''} id={id} searchText={searchText} icon={<PlatformIcon />} />
  );
}
