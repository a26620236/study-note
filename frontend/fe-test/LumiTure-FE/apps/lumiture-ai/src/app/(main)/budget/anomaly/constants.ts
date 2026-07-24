export enum Sensitivity {
  Low,
  Medium,
  High,
}

export enum Roles {
  Admin = 'admin',
  T1Manager = 't1Manager',
  T1Member = 't1Member',
  T2Manager = 't2Manager',
  T2Member = 't2Member',
}

export const NotificationSettingFieldNames = {
  detection: 'detection',
  sensitivity: 'sensitivity',
  notification: 'notification',
  alert: 'alert',
} as const;

export enum AnomalyToggleCategory {
  All = 'all',
  Pinned = 'pinned',
}
