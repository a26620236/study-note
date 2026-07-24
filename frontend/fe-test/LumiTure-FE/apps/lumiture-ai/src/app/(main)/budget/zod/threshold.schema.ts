import { isNumber } from 'lodash-es';
import { z } from 'zod';

import { THRESHOLD_RANGE } from '@app/(main)/budget/constants/threshold';

export const thresholdsSchema = z
  .array(
    z.union([
      z
        .number()
        .min(
          THRESHOLD_RANGE.MIN,
          `Please enter a number from ${THRESHOLD_RANGE.MIN} to ${THRESHOLD_RANGE.MAX}.`
        )
        .max(
          THRESHOLD_RANGE.MAX,
          `Please enter a number from ${THRESHOLD_RANGE.MIN} to ${THRESHOLD_RANGE.MAX}.`
        ),
      z.null(),
    ])
  )
  .superRefine((thresholds, ctx) => {
    if (thresholds.length === 0) return;

    const duplicates = thresholds.filter(
      (value, index) => isNumber(value) && thresholds.indexOf(value) !== index
    );

    duplicates.forEach((value) => {
      thresholds.forEach((threshold, index) => {
        if (threshold === value) {
          ctx.addIssue({
            code: 'custom',
            message: 'Please do not enter duplicate thresholds.',
            path: [index],
          });
        }
      });
    });

    thresholds.forEach((value, index) => {
      if (value === null) {
        ctx.addIssue({
          code: 'custom',
          message: 'Threshold cannot be empty.',
          path: [index],
        });
      }
    });
  });
