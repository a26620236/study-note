import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import { Typography } from '@mui/material';

import { MultiSelect, VStack, type MultiSelectChangeEvent } from '@lumiture-ui';

import { PlatformsValue } from '@constants';
import { AWSChargeTypes, type GCPCredit } from '@hooks-api';

import {
  awsChargeTypesOptions,
  awsCreditOptions,
  gcpCreditOptions,
} from '../../constants/creditsOptions';
import { useCostDashboardStore } from '../../hooks/useCostDashboardStore';

export const CREDITS_LABELS = {
  creditsTooltip:
    'When you select Credits, the amount will be deducted from the total cost, and the deducted Credit amount will be displayed.',
};

/**
 * Credits/ChargeTypes Filter
 * - GCP: 使用 credit 欄位，顯示 Credit 選項
 * - AWS: 使用 chargeTypes 欄位，顯示 ChargeTypes 和 Credit 選項
 * - Azure: 不顯示
 */
export function CreditsFilter() {
  const { platform } = useParams<{ platform: PlatformsValue }>();
  const { [platform]: platformAllFilters, handleSetFilter } = useCostDashboardStore(
    (state) => state
  );

  const isGCPFilter = platform === PlatformsValue.GCP;
  const isAWSFilter = platform === PlatformsValue.AWS;

  // 取得 GCP credit 或 AWS chargeTypes
  const gcpCredit = useMemo(
    () => (isGCPFilter && 'credits' in platformAllFilters ? platformAllFilters.credits : []),
    [isGCPFilter, platformAllFilters]
  );

  const awsChargeTypes = useMemo(
    () =>
      isAWSFilter && 'chargeTypes' in platformAllFilters ? platformAllFilters.chargeTypes : [],
    [isAWSFilter, platformAllFilters]
  );

  // AWS: 將 chargeTypes 分成兩部分
  // 1. ChargeTypes: 過濾掉 Credit
  const initialAWSChargeTypes = useMemo(
    () => awsChargeTypes.filter((type) => type !== AWSChargeTypes.Credit),
    [awsChargeTypes]
  );
  // 2. Credit: 只保留 Credit
  const initialAWSCredit = useMemo(
    () => awsChargeTypes.filter((type) => type === AWSChargeTypes.Credit),
    [awsChargeTypes]
  );

  const [tempGCPCredit, setTempGCPCredit] = useState<GCPCredit[]>(gcpCredit);
  const [tempAWSChargeTypes, setTempAWSChargeTypes] =
    useState<AWSChargeTypes[]>(initialAWSChargeTypes);
  const [tempAWSCredit, setTempAWSCredit] = useState<AWSChargeTypes[]>(initialAWSCredit);

  useEffect(() => {
    setTempGCPCredit(gcpCredit);
  }, [gcpCredit]);

  useEffect(() => {
    setTempAWSChargeTypes(initialAWSChargeTypes);
  }, [initialAWSChargeTypes]);

  useEffect(() => {
    setTempAWSCredit(initialAWSCredit);
  }, [initialAWSCredit]);

  const creditsNote = (
    <Typography variant="caption" color="text.secondary">
      {CREDITS_LABELS.creditsTooltip}
    </Typography>
  );

  if (isGCPFilter) {
    const handleChange = ({ value }: MultiSelectChangeEvent<GCPCredit>) => {
      setTempGCPCredit(value);
    };

    const handleClose = () => {
      handleSetFilter(platform, { credits: tempGCPCredit });
    };

    return (
      <>
        <MultiSelect
          configKey="credit"
          label="Credit"
          selectPlaceholder="Select Credit"
          options={gcpCreditOptions}
          value={tempGCPCredit}
          onChange={handleChange}
          handleClose={handleClose}
        />
        {creditsNote}
      </>
    );
  }

  if (isAWSFilter) {
    const handleChange = ({ value }: MultiSelectChangeEvent<AWSChargeTypes>) => {
      setTempAWSChargeTypes(value);
    };

    const handleChangeCredit = ({ value }: MultiSelectChangeEvent<AWSChargeTypes>) => {
      setTempAWSCredit(value);
    };

    const handleClose = () => {
      const mergedChargeTypes = [...tempAWSChargeTypes, ...tempAWSCredit];
      handleSetFilter(platform, { chargeTypes: mergedChargeTypes });
    };

    return (
      <>
        <VStack gap={4}>
          <MultiSelect
            configKey="chargeTypes"
            label="Charge Types"
            selectPlaceholder="Select Charge Types"
            options={awsChargeTypesOptions}
            value={tempAWSChargeTypes}
            onChange={handleChange}
            handleClose={handleClose}
          />
          <MultiSelect
            configKey="credit"
            label="Credit"
            selectPlaceholder="Select Credit"
            options={awsCreditOptions}
            value={tempAWSCredit}
            onChange={handleChangeCredit}
            handleClose={handleClose}
          />
        </VStack>
        {creditsNote}
      </>
    );
  }

  return null;
}
