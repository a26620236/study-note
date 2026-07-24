'use client';

import { useState, type SyntheticEvent } from 'react';

import { TabPanel, Tabs, VStack } from '@lumiture-ui';

import { AWS, AZURE, GCP, type PlatformsValue } from '@constants';

import { AWSResourcesContent } from './aws/AWSResourcesContent';
import { AzureResourcesContent } from './azure/AzureResourcesContent';
import { GCPResourcesContent } from './gcp/GCPResourcesContent';

export function ResourcesTableWithTabs() {
  const CLOUD_PROVIDER_OPTIONS = [GCP, AWS, AZURE];
  const [tabValue, setTabValue] = useState<PlatformsValue>(CLOUD_PROVIDER_OPTIONS[0].value);

  const handleTabChange = (_event: SyntheticEvent, newValue: PlatformsValue) => {
    setTabValue(newValue);
  };

  return (
    <VStack gap={4}>
      <Tabs value={tabValue} onChange={handleTabChange} tabItems={CLOUD_PROVIDER_OPTIONS} />
      <TabPanel value={tabValue} tabKey={CLOUD_PROVIDER_OPTIONS[0].value}>
        <GCPResourcesContent />
      </TabPanel>
      <TabPanel value={tabValue} tabKey={CLOUD_PROVIDER_OPTIONS[1].value}>
        <AWSResourcesContent />
      </TabPanel>
      <TabPanel value={tabValue} tabKey={CLOUD_PROVIDER_OPTIONS[2].value}>
        <AzureResourcesContent />
      </TabPanel>
    </VStack>
  );
}
