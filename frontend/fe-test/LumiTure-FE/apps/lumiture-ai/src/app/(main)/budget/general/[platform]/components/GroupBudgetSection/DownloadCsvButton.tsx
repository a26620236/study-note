import { Button, Icon } from '@lumiture-ui';
import { popErrorToast } from '@shared/utils';

import { Segment, useGetCurrentGroupBudget, usePostBudgetCsv } from '@hooks-api';

import { useBudgetSettingsStore } from '../../hooks/useBudgetSettingsStore';

const LABELS = {
  downloadCsv: 'Download CSV',
  downloadError: 'Failed to export CSV. Please try again later.',
};

export const DownloadCsvButton = () => {
  const fiscalYear = useBudgetSettingsStore((state) => state.fiscalYear);

  const { data } = useGetCurrentGroupBudget({ segment: Segment.MONTHLY, fiscalYear });
  const effectiveFiscalYear = fiscalYear ?? data?.data.fiscalYear;

  const { mutate, isPending } = usePostBudgetCsv({
    onSuccess: (response) => {
      window.open(response.data.link, '_blank');
    },
    onError: () => {
      popErrorToast({ description: LABELS.downloadError });
    },
  });

  const handleDownload = () => {
    if (effectiveFiscalYear === undefined) return;
    mutate({ fiscalYear: effectiveFiscalYear, segment: Segment.MONTHLY });
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Icon name="download" />}
      onClick={handleDownload}
      isLoading={isPending}
      disabled={effectiveFiscalYear === undefined}
    >
      {LABELS.downloadCsv}
    </Button>
  );
};
