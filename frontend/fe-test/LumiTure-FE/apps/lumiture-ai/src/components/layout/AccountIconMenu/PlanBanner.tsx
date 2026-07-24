import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format, isValid } from 'date-fns';
import { useSession } from 'next-auth/react';

import { basicColor } from '@lumiture-ui/theme';

import { PlanName } from '@constants';

const planBannerStyles = {
  [PlanName.FreeTrial]: { bgcolor: 'primary.main' },
  [PlanName.Essential]: { bgcolor: basicColor.primary.rackleyBlue[60] },
  [PlanName.Starter]: { bgcolor: basicColor.primary.skyBlue[50] },
  [PlanName.Standard]: { bgcolor: 'primary.main' },
  [PlanName.Premium]: {
    background: `linear-gradient(270deg, ${basicColor.primary.yellow[80]} 0%, ${basicColor.primary.yellow[70]} 100%)`,
  },
} as const;

const PlanBanner = () => {
  const { data: session } = useSession();
  const plan = session?.user.plan;

  if (!plan?.planId) return null;

  const bannerStyles = planBannerStyles[plan.planName];

  const formatDate = (date: string | null) => {
    if (!date) return '--';
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, 'd MMM. yyyy').toUpperCase() : '--';
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: 6, py: 2, ...bannerStyles }}
    >
      <Typography variant="bodyBold">{`${plan.planName} Plan`}</Typography>
      <Typography variant="caption">{`${formatDate(plan.startDate)} ~ ${formatDate(plan.endDate)}`}</Typography>
    </Stack>
  );
};

export default PlanBanner;
