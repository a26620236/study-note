/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

import type { BillingCycle, CurrencyCode, CurrencyOption, Depth, PlanName, Role } from '@constants';

interface CurrentGroup {
  groupId: number;
  depth: Depth;
  groupName: string;
  character: Role;
}
interface ParentGroups {
  groupId: number;
  depth: Depth;
}
type DateString = `${number}-${number}-${number}`;
interface Plan {
  planId: number;
  planName: PlanName;
  billingCycle: BillingCycle;
  startDate: DateString;
  endDate: DateString;
}

declare module 'next-auth' {
  interface User {
    access: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    group: CurrentGroup | null;
    groups: ParentGroups[];
    plan: Plan;
    currency: CurrencyCode;
    currencyInfo: CurrencyOption; // 前端定義 currency 相關的資訊
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}
declare module 'next-auth' {
  interface Session {
    user: User;
  }
}
