import { useParams } from 'next/navigation';

import { Box, Typography } from '@mui/material';

import { Button, HStack, Icon, VStack } from '@lumiture-ui';
import { downloadFile } from '@shared/utils';

import { useDownloadAnomalyDetectionCostDetailsCSV } from '@hooks-api';

import type { AnomalyReportPageParams } from '../type';
import { TopCostResourcesTable } from './TopCostResourcesTable';

interface Top10ServicesCostBreakdownSectionProps {
  isScreenshotMode?: boolean;
}

const LABELS = {
  title: 'Top 10 Services: 36-Hour Cost Breakdown',
  description:
    'We recommend logging into your console to verify the accurate status and fees. The cost information here is for reference.',
  downloadButtonLabel: 'Download CSV',
};

export function Top10ServicesCostBreakdownSection({
  isScreenshotMode = false,
}: Top10ServicesCostBreakdownSectionProps) {
  const { alertId } = useParams<AnomalyReportPageParams>();
  const downloadAnomalyDetectionCostDetailsCSV = useDownloadAnomalyDetectionCostDetailsCSV(alertId);

  const handleDownloadCsv = async () => {
    try {
      const res = await downloadAnomalyDetectionCostDetailsCSV.mutateAsync();
      if (!res.data.link) return;
      downloadFile({ downloadUrl: res.data.link, filename: `anomaly_detection_report.csv` });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VStack sx={{ width: '100%' }} gap={4}>
      <VStack gap={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{LABELS.title}</Typography>
          {!isScreenshotMode && (
            <Button
              startIcon={<Icon name="download" sx={{ color: 'primary.main' }} />}
              variant="outlined"
              size="small"
              data-testid={`${alertId}-download-csv-button`}
              onClick={handleDownloadCsv}
            >
              {LABELS.downloadButtonLabel}
            </Button>
          )}
        </HStack>
        <Typography variant="body1" color="text.secondary">
          {LABELS.description}
        </Typography>
      </VStack>
      <Box sx={{ width: '100%', minHeight: '200px' }}>
        <TopCostResourcesTable />
      </Box>
    </VStack>
  );
}
