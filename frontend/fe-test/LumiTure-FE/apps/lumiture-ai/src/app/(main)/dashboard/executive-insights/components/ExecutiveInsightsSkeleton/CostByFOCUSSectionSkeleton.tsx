'use client';

import { Box, Paper, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { HStack, VStack } from '@lumiture-ui';
import { theme } from '@lumiture-ui/theme';

const LABELS = {
  costByFOCUS: {
    title: 'Cost by FOCUS Framework',
  },
};

export function CostByFOCUSSectionSkeleton() {
  return (
    <Paper sx={{ padding: '24px', borderRadius: '12px', width: '100%' }}>
      <VStack gap={4}>
        <Typography variant="h6">{LABELS.costByFOCUS.title}</Typography>
        <HStack sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Skeleton variant="rounded" sx={{ width: '50px', height: '14px' }} />
          <Skeleton variant="rounded" sx={{ width: '200px', height: '14px' }} />
        </HStack>

        <HStack sx={{ width: '100%', gap: 4 }}>
          <VStack gap={3} sx={{ flex: 6 }}>
            <HStack gap={2} sx={{ height: '360px' }}>
              <Skeleton variant="rounded" sx={{ flex: 5, height: '100%', borderRadius: '8px' }} />
              <VStack gap={2} sx={{ flex: 7, height: '100%' }}>
                <HStack gap={2} sx={{ flex: 1 }}>
                  <Skeleton
                    variant="rounded"
                    sx={{ flex: 2, height: '100%', borderRadius: '8px' }}
                  />
                  <Skeleton
                    variant="rounded"
                    sx={{ flex: 1, height: '100%', borderRadius: '8px' }}
                  />
                </HStack>
                <HStack gap={2} sx={{ flex: 1 }}>
                  <Skeleton
                    variant="rounded"
                    sx={{ flex: 5, height: '100%', borderRadius: '8px' }}
                  />
                  <VStack gap={2} sx={{ flex: 3, height: '100%' }}>
                    <Skeleton variant="rounded" sx={{ flex: 2, borderRadius: '8px' }} />
                    <HStack gap={2} sx={{ flex: 1 }}>
                      <Skeleton
                        variant="rounded"
                        sx={{ flex: 2, height: '100%', borderRadius: '8px' }}
                      />
                      <Skeleton
                        variant="rounded"
                        sx={{ flex: 1, height: '100%', borderRadius: '8px' }}
                      />
                    </HStack>
                  </VStack>
                  <VStack gap={2} sx={{ flex: 1, height: '100%' }}>
                    <Skeleton variant="rounded" sx={{ flex: 3, borderRadius: '8px' }} />
                    <Skeleton variant="rounded" sx={{ flex: 2, borderRadius: '8px' }} />
                    <Skeleton variant="rounded" sx={{ flex: 1, borderRadius: '8px' }} />
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Skeleton variant="rounded" sx={{ width: '200px', height: '14px' }} />
            </Box>
          </VStack>
          <VStack
            sx={{
              flex: 5,
              border: `1px solid ${theme.palette.gray.borderLight}`,
              borderRadius: '8px',
              padding: '16px',
              justifyContent: 'space-between',
            }}
          >
            <Skeleton variant="rounded" sx={{ width: '100%', height: '18px' }} />
            {Array.from({ length: 10 }, (_, index) => (
              <HStack key={index} gap={2}>
                <Skeleton variant="rounded" sx={{ width: '100%', height: '14px', flex: 3 }} />
                <Skeleton variant="rounded" sx={{ width: '100%', height: '14px', flex: 1 }} />
                <Skeleton variant="rounded" sx={{ width: '100%', height: '14px', flex: 1 }} />
                <Skeleton variant="rounded" sx={{ width: '100%', height: '14px', flex: 1 }} />
              </HStack>
            ))}
          </VStack>
        </HStack>
      </VStack>
    </Paper>
  );
}
