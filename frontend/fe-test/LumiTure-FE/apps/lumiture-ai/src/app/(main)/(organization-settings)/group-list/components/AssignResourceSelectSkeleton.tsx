import { Skeleton, Typography } from '@mui/material';

import { InputLabel, VStack } from '@lumiture-ui';

interface AssignResourceSelectSkeletonProps {
  label: string;
}

export function AssignResourceSelectSkeleton({ label }: AssignResourceSelectSkeletonProps) {
  return (
    <VStack gap={0.5}>
      <InputLabel
        label={
          <Typography variant="buttonBold1" color="primary.main">
            {label}
          </Typography>
        }
        required={false}
        rootSx={{ marginBottom: '4px' }}
      />
      <Skeleton variant="rectangular" height={36} />
    </VStack>
  );
}
