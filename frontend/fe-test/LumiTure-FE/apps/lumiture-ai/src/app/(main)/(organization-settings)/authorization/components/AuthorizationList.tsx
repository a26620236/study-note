'use client';

import { VStack } from '@lumiture-ui';

import { useGetAuthorizationList } from '@hooks-api';

import { AuthorizationListSkeleton } from './AuthorizationListSkeleton';
import { AWSAuthorizationSection } from './AWSAuthorizationSection/AWSAuthorizationSection';
import { AzureAuthorizationSection } from './AzureAuthorizationSection/AzureAuthorizationSection';
import { GCPAuthorizationSection } from './GCPAuthorizationSection/GCPAuthorizationSection';

export function AuthorizationList() {
  const { isLoading } = useGetAuthorizationList();

  if (isLoading) {
    return <AuthorizationListSkeleton />;
  }

  return (
    <VStack sx={{ gap: 8 }}>
      <GCPAuthorizationSection />
      <AWSAuthorizationSection />
      <AzureAuthorizationSection />
    </VStack>
  );
}
