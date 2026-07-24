import { Box, Typography, type TypographyProps } from '@mui/material';

import { HighlightText, VStack } from '@lumiture-ui';

import type { Summary } from '@hooks-ws';

const LABELS = {
  summaryTitle: 'Cloud Cost Analysis Summary',
  keyCostDriversTitle: 'Key Cost Drivers',
  noSubGroupSpendingMessage:
    "The groups under your management recorded no expenditure during this period. All resources remain inactive, consistent with the previous period's activity.",
};

interface CostSummaryProps {
  summary?: Summary;
  titleVariant: TypographyProps['variant'];
  contentVariant: TypographyProps['variant'];
}

export const CostSummary = ({
  summary,
  titleVariant = 'captionBold',
  contentVariant = 'caption',
}: CostSummaryProps) => {
  const { overallSummary, keyCostDrivers } = summary ?? {};

  const hasOrgSpending = !!(keyCostDrivers?.length && keyCostDrivers.length > 0);
  const hasSubGroupSpending = !!keyCostDrivers?.some(
    (keyCostDriver) => keyCostDriver.subGroups.length > 0
  );

  return (
    <VStack>
      <Typography variant={titleVariant} color="text.secondary">
        {LABELS.summaryTitle}
      </Typography>
      <Typography variant={contentVariant} color="text.secondary">
        {overallSummary}
      </Typography>
      {hasOrgSpending && (
        <>
          <br />
          <Typography variant={titleVariant} color="text.secondary">
            {LABELS.keyCostDriversTitle}
          </Typography>
          {hasSubGroupSpending ? (
            <>
              {keyCostDrivers.map((keyCostDriver) => (
                <Box key={keyCostDriver.name}>
                  <HighlightText
                    text={keyCostDriver.summary}
                    highlightText={keyCostDriver.name}
                    variant={contentVariant}
                    color="text.secondary"
                  />
                  <Box component="ul" sx={{ margin: 0, paddingLeft: 6 }}>
                    {keyCostDriver.subGroups.map((subGroup) => (
                      <Box component="li" key={subGroup.name} sx={{ fontSize: 10 }}>
                        <Typography
                          component="span"
                          variant={titleVariant}
                          color="text.secondary"
                        >{`${subGroup.name}: `}</Typography>
                        <Typography
                          component="span"
                          variant={contentVariant}
                          color="text.secondary"
                        >
                          {subGroup.summary}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </>
          ) : (
            <Typography component="span" variant={titleVariant} color="text.secondary">
              {LABELS.noSubGroupSpendingMessage}
            </Typography>
          )}
        </>
      )}
    </VStack>
  );
};
