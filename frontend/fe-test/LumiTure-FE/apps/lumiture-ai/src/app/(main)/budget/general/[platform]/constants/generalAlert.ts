import { Depth } from '@constants';

export const DISPLAY_TITLE_BY_DEPTH = {
  [Depth.ADMIN]: 'Tier 1 Group Budget',
  [Depth.T1]: 'Tier 2 Group Budget',
  [Depth.T2]: null,
};
export const FORM_ID = {
  THRESHOLD: 'thresholds',
  ADMIN: {
    OWN: 'notification.admin.organization',
    CHILD: 'notification.admin.childGroups',
  },
  T1_MANAGER: {
    OWN: 'notification.t1Manager.ownGroup',
    CHILD: 'notification.t1Manager.childGroups',
  },
  T1_MEMBER: {
    OWN: 'notification.t1Member.ownGroup',
    CHILD: 'notification.t1Member.childGroups',
  },
  T2_MANAGER: {
    OWN: 'notification.t2Manager.ownGroup',
  },
  T2_MEMBER: {
    OWN: 'notification.t2Member.ownGroup',
  },
} as const;

export const FORM_LABELS = {
  ADMIN: {
    TITLE: 'Admin',
    OWN: 'Organization',
    CHILD: 'All Tier 1 groups',
  },
  T1_MANAGER: {
    TITLE: 'Tier 1 Manager',
    OWN: 'Their own group',
    CHILD: 'Their Tier 2 groups',
  },
  T1_MEMBER: {
    TITLE: 'Tier 1 Member',
    OWN: 'Their own group',
    CHILD: 'Their Tier 2 groups',
  },
  T2_MANAGER: {
    TITLE: 'Tier 2 Manager',
    OWN: 'Their own group',
  },
  T2_MEMBER: {
    TITLE: 'Tier 2 Member',
    OWN: 'Their own group',
  },
} as const;

export const MAXIMUM_THRESHOLDS = 3;

export const defaultValues = {
  thresholds: [],
  notification: {
    admin: { organization: false, childGroups: false },
    t1Manager: { ownGroup: false, childGroups: false },
    t1Member: { ownGroup: false, childGroups: false },
    t2Manager: { ownGroup: false },
    t2Member: { ownGroup: false },
  },
};
