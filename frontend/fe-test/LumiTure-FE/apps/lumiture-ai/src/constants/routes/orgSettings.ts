export const ORG_SETTINGS_PATHS = {
  organizationSettings: {
    key: 'organizationSettings',
    name: 'Organization Settings',
    pathname: '',
    icon: null,
  },

  // lumitag
  lumiTag: {
    key: 'lumiTag',
    name: 'LumiTag',
    pathname: '/lumitag',
    icon: 'sell',
  },
  lumiTagSettings: {
    key: 'lumiTagSettings',
    name: 'LumiTag Settings',
    pathname: '/lumitag/settings',
    icon: null,
  },

  /* group list
    這邊有兩個路徑都導向'/group-list/tier-one-groups'
    是因為 admin 和 tier one 的頁面是相同的，所以共用一個路徑。
  */
  groupListAdmin: {
    key: 'groupListAdmin',
    name: 'Group List',
    pathname: '/group-list/tier-one-groups',
    icon: 'groups',
  },
  groupListTierOne: {
    key: 'groupListTierOne',
    name: 'Group List',
    pathname: '/group-list/tier-one-groups',
    icon: 'groups',
  },
  tierOneUser: {
    key: 'tierOneUser',
    name: 'User List',
    pathname: '/group-list/tier-one-groups/[tierOneGroupId]?tab=group-members',
    icon: null,
  },
  tierOneResources: {
    key: 'tierOneResources',
    name: 'Resource List',
    pathname: '/group-list/tier-one-groups/[tierOneGroupId]?tab=resources',
    icon: null,
  },
  tierOneGroupTierTwoGroups: {
    key: 'tierOneGroupTierTwoGroups',
    name: 'Tier 2 Group List',
    pathname: '/group-list/tier-one-groups/[tierOneGroupId]?tab=tier-2-groups',
    icon: null,
  },
  groupListTierTwo: {
    key: 'groupListTierTwo',
    name: 'Group List',
    pathname: '/group-list/tier-one-groups/[tierOneGroupId]/tier-two-groups',
    icon: 'groups',
  },
  tierTwoUser: {
    key: 'tierTwoUser',
    name: 'User List',
    pathname:
      '/group-list/tier-one-groups/[tierOneGroupId]/tier-two-groups/[tierTwoGroupId]?tab=group-members',
    icon: null,
  },
  tierTwoResources: {
    key: 'tierTwoResources',
    name: 'Resource List',
    pathname:
      '/group-list/tier-one-groups/[tierOneGroupId]/tier-two-groups/[tierTwoGroupId]?tab=resources',
    icon: null,
  },

  // auth list
  authorizationList: {
    key: 'authorizationList',
    name: 'Authorization List',
    pathname: '/authorization',
    icon: 'link',
  },
  billingDataIntegration: {
    key: 'billingDataIntegration',
    name: 'Billing Data Integration',
    pathname: '/authorization/billing-integration/[platform]',
    icon: null,
  },
  usageIntegration: {
    key: 'usageIntegration',
    name: 'Usage Data Integration',
    pathname: '/authorization/usage-integration/[platform]',
    icon: null,
  },

  // admin list
  adminList: {
    key: 'adminList',
    name: 'Admin List',
    pathname: '/admin/users',
    icon: 'manage_accounts',
  },

  // audit log
  auditLog: {
    key: 'auditLog',
    name: 'Audit Log',
    pathname: '/audit-log',
    icon: 'receipt_long',
  },
} as const;
