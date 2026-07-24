import { AWSChargeTypes, AWSChargeTypesMap, GCPCredit, GCPCreditMap } from '@hooks-api';

// GCP Credit 選項
export const gcpCreditOptions = [
  { id: GCPCredit.FreeTier, name: GCPCreditMap[GCPCredit.FreeTier] },
  { id: GCPCredit.Discount, name: GCPCreditMap[GCPCredit.Discount] },
  { id: GCPCredit.SustainedUsageDiscount, name: GCPCreditMap[GCPCredit.SustainedUsageDiscount] },
  { id: GCPCredit.CommittedUsageDiscount, name: GCPCreditMap[GCPCredit.CommittedUsageDiscount] },
  { id: GCPCredit.Promotion, name: GCPCreditMap[GCPCredit.Promotion] },
  { id: GCPCredit.Others, name: GCPCreditMap[GCPCredit.Others] },
];

// AWS ChargeTypes 選項 (不含 Credit)
export const awsChargeTypesOptions = [
  { id: AWSChargeTypes.Usage, name: AWSChargeTypesMap[AWSChargeTypes.Usage] },
  {
    id: AWSChargeTypes.OtherOutOfCycleCharge,
    name: AWSChargeTypesMap[AWSChargeTypes.OtherOutOfCycleCharge],
  },
  { id: AWSChargeTypes.SupportFees, name: AWSChargeTypesMap[AWSChargeTypes.SupportFees] },
  { id: AWSChargeTypes.Tax, name: AWSChargeTypesMap[AWSChargeTypes.Tax] },
];

// AWS Credit 選項
export const awsCreditOptions = [
  { id: AWSChargeTypes.Credit, name: AWSChargeTypesMap[AWSChargeTypes.Credit] },
];
