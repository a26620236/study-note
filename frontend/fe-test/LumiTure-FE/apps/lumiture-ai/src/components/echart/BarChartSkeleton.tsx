import { Grid, Skeleton, Stack } from '@mui/material';

export const BarChartSkeleton = () => {
  const yAxisCnt = 5;
  const xAxisCnt = 16;
  const bars = [
    48, 142, 280, 300, 200, 80, 65, 98, 280, 160, 200, 247, 186, 300, 260, 120, 178, 280, 260, 374,
    200, 217, 172, 43, 194,
  ];
  const yAxisLineStyle = {
    '&:after': {
      content: '""',
      position: 'absolute',
      right: 0,
      width: 'calc(100% - 60px)',
      height: '1px',
      transform: 'translateY(6px)',
      borderTop: '1px dashed',
      borderColor: 'gray.borderLight',
    },
    '&:last-of-type:after': {
      borderTop: '1px solid',
      borderColor: 'gray.borderLight',
    },
  };

  return (
    <Stack direction="row" sx={{ gap: 5 }} position="relative">
      {/* y axis */}
      <Stack justifyContent="space-between" sx={{ pt: 10, pb: 5 }}>
        {new Array(yAxisCnt).fill(true).map((_, i) => (
          <Stack key={`yAxis${i}`} sx={yAxisLineStyle}>
            <Skeleton width={50} height={12} />
          </Stack>
        ))}
      </Stack>
      <Stack sx={{ flex: 1 }}>
        {/* bar */}
        <Stack direction="row" alignItems="flex-end" justifyContent="space-evenly" sx={{ pb: 3.5 }}>
          {bars.map((barH, i) => (
            <Skeleton key={`bar${i}`} variant="rectangular" width={16} height={barH} />
          ))}
        </Stack>
        {/* x axis */}
        <Grid container spacing={1.5}>
          {new Array(xAxisCnt).fill(true).map((_, i) => (
            <Grid key={`xAxis${i}`} size={12 / xAxisCnt}>
              <Skeleton width="100%" height={12} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
