export type TierOneGroupParams = {
  tierOneGroupId: string;
};

export type TierTwoGroupParams = {
  tierTwoGroupId: string;
};

export type TierOneAndTwoGroupParams = {
  tierOneGroupId: string;
  tierTwoGroupId: string;
};

/** 用於可能在 TierOne 或 TierTwo 頁面的共用元件 */
export type GroupParams = {
  tierOneGroupId: string;
  tierTwoGroupId?: string;
};
