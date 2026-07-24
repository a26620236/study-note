import { useRouter, useSearchParams } from 'next/navigation';

import { Typography } from '@mui/material';

import { Button, HStack, Icon, ToggleGroup } from '@lumiture-ui';

import { OPTIMIZATION_PATHS } from '@constants';
import { ScopeStatusEnum, useGetRightsizingSettings } from '@hooks-api';

import { RIGHTSIZING_SETTINGS_DRAFT_SCOPE_ID } from '../constants/rightsizingSettings';

const LABELS = {
  addNewScope: 'Add New Scope',
  tooltip: "You've added all available scopes.",
};

export function RightsizingSettingsToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentScopeId = searchParams.get('scopeId');

  const { data: rightsizingSettings } = useGetRightsizingSettings(currentScopeId);
  const scopes = rightsizingSettings?.data.scopes ?? [];

  const activeScope = scopes.find((scope) => scope.scopeId === currentScopeId) ?? scopes[0];
  const hasUnConfiguredScope = scopes.some((scope) => scope.scopeStatus === ScopeStatusEnum.Draft);

  const handleScopeChange = (_event: React.MouseEvent<HTMLElement>, newScopeId: string) => {
    router.push(
      `${OPTIMIZATION_PATHS.usageOptimizationScopeSettings.pathname}?scopeId=${newScopeId}`
    );
  };

  const handleAddNewScope = () => {
    router.push(
      `${OPTIMIZATION_PATHS.usageOptimizationScopeSettings.pathname}?scopeId=${RIGHTSIZING_SETTINGS_DRAFT_SCOPE_ID}`
    );
  };

  const toggleButtons = scopes.map((scope) => ({
    value: scope.scopeId,
    children: (
      <Typography variant="button" sx={{ textTransform: 'none' }}>
        {scope.scopeName}
      </Typography>
    ),
    key: scope.scopeId,
    onChange: handleScopeChange,
  }));

  // we only allow up to 3 scopes to be created
  const isAddNewScopeDisabled = hasUnConfiguredScope || scopes.length === 3;

  return (
    <HStack sx={{ justifyContent: 'space-between', alignItems: 'end' }}>
      <Typography variant="h5">{activeScope.scopeName}</Typography>
      <HStack sx={{ gap: 2 }}>
        <ToggleGroup
          toggleGroupProps={{
            value: activeScope.scopeId,
          }}
          toggleButtons={toggleButtons}
        />
        <Button
          startIcon={<Icon name="add" />}
          onClick={handleAddNewScope}
          tooltipProps={
            isAddNewScopeDisabled ? { title: LABELS.tooltip, placement: 'top' } : undefined
          }
          disabled={isAddNewScopeDisabled}
        >
          {LABELS.addNewScope}
        </Button>
      </HStack>
    </HStack>
  );
}
