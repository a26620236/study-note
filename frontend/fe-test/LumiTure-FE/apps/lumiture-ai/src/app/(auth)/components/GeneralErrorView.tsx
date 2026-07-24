import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';

import { Button } from '@lumiture-ui';

import EmptyState from '@components/EmptyState/EmptyState';
import { OVERVIEW_PATHS } from '@constants';

const GeneralErrorView = () => {
  const router = useRouter();

  const handleRefreshClick = () => {
    window.location.reload();
  };
  const handleGoOverviewClick = () => {
    router.push(OVERVIEW_PATHS.overview.pathname);
  };

  return (
    <EmptyState
      size="medium"
      type="error"
      title="Sorry, Something Went Wrong"
      desc={`This may be due to a network issue, an incorrect URL, or insufficient permissions to access this page.
Please try refreshing or return to the homepage.`}
    >
      <Stack direction="row" alignItems="center" gap={4} sx={{ mt: 6 }}>
        <Button variant="outlined" onClick={handleRefreshClick}>
          Refresh
        </Button>
        <Button onClick={handleGoOverviewClick}>Return to Home Page</Button>
      </Stack>
    </EmptyState>
  );
};

export default GeneralErrorView;
