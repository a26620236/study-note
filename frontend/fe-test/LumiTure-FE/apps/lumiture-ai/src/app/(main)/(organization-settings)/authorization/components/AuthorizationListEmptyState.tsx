import { Paper } from '@mui/material';

import { CUSTOMIZED_EMPTY_CONTENT } from '@components/EmptyState/constants';
import EmptyState from '@components/EmptyState/EmptyState';

export function AuthorizationListEmptyState() {
  return (
    <Paper>
      <EmptyState
        size="small"
        type="error"
        sx={{ minHeight: 'none', padding: '20px 0' }}
        {...CUSTOMIZED_EMPTY_CONTENT.emptyAuthorization}
      />
    </Paper>
  );
}
