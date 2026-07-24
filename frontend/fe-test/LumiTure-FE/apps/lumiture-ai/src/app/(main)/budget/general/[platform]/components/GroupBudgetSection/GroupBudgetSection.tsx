import { Box, Typography } from '@mui/material';
import { isNumber } from 'lodash-es';
import { useSession } from 'next-auth/react';

import { HStack, VStack } from '@lumiture-ui';

import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';
import TableSkeleton from '@components/table/TableSkeleton';
import {
  BudgetCrossCloudValue,
  Segment,
  useGetChildGroupBudget,
  type BudgetPlatformValue,
} from '@hooks-api';

import { DISPLAY_TITLE_BY_DEPTH } from '../../constants/generalAlert';
import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';
import { GeneralBudgetAlert } from '../GeneralBudgetAlert/GeneralBudgetAlert';
import { GroupBudgetTable } from '../GroupBudgetTable/GroupBudgetTable';
import { BulkActions } from './BulkActions';
import { DownloadCsvButton } from './DownloadCsvButton';
import { EditBudgetButton } from './EditBudgetButton';
import { GroupBudgetTabs } from './GroupBudgetTabs';
import { MonthlyViewToggle } from './MonthlyViewToggle';

interface GroupBudgetSectionProps {
  platform: BudgetPlatformValue;
}

const LABELS = {
  unlimitedNote:
    "*When the budget input field is left blank or shows '--', it indicates that no budget limit has been set (unlimited).",
};

export const GroupBudgetSection = ({ platform }: GroupBudgetSectionProps) => {
  const { data: session } = useSession();
  const depth = session?.user.group?.depth;
  const groupBudgetTitle = isNumber(depth) ? DISPLAY_TITLE_BY_DEPTH[depth] : null;

  const isEditing = useBudgetSettingsStore((state) => state.isEditing);
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const {
    data: childGroupBudgetData,
    isSuccess,
    isLoading,
  } = useGetChildGroupBudget({
    platform,
    segment: Segment.MONTHLY,
    fiscalYear,
  });
  const isEmptyChildGroups = isSuccess && childGroupBudgetData.data.budget.length === 0;

  // 切換財年會換 query key 重新取資料，data 為 undefined 期間顯示 table skeleton
  const renderTableContent = () => {
    if (isLoading) return <TableSkeleton columns={5} rows={5} showFooter />;
    if (isEmptyChildGroups) {
      return (
        <VStack sx={{ minHeight: 320 }}>
          <EmptyState type="emptyList" {...CUSTOMIZED_EMPTY_CONTENT.emptyGroup} />
        </VStack>
      );
    }
    return (
      <VStack width="100%">
        <GroupBudgetTable platform={platform} />
      </VStack>
    );
  };

  return (
    <Box mt={14}>
      {/* 控制列：標題 + Download CSV + Edit Budget，三者同列 */}
      <HStack justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{groupBudgetTitle}</Typography>
        <HStack gap={4} alignItems="center">
          {!isEditing && <DownloadCsvButton />}
          <EditBudgetButton platform={platform} />
        </HStack>
      </HStack>
      {platform !== BudgetCrossCloudValue.Total && <GeneralBudgetAlert />}
      <GroupBudgetTabs platform={platform} />
      <MonthlyViewToggle />
      <VStack gap={6} sx={{ pt: 6 }}>
        <VStack width="100%">
          {/* Total 不可編輯，批次操作僅在單一平台編輯模式出現 */}
          {platform !== BudgetCrossCloudValue.Total && isEditing && <BulkActions />}
          {renderTableContent()}
        </VStack>
        <Typography color="text.hint" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
          {LABELS.unlimitedNote}
        </Typography>
      </VStack>
    </Box>
  );
};
