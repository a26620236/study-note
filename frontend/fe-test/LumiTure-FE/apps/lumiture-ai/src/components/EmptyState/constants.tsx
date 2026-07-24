export const SIZES = {
  small: {
    iconSize: 64,
    titleVariant: 'h6',
  },
  medium: {
    iconSize: 80,
    titleVariant: 'h5',
  },
  large: {
    iconSize: 120,
    titleVariant: 'h4',
  },
} as const;

export const DEFAULT_EMPTY_CONTENT = {
  error: {
    title: 'Something Went Wrong',
    desc: 'Please ensure you have a stable internet connection\nand try refreshing the page.',
    iconUrl: '/images/error.svg',
  },
  emptyList: {
    title: 'No Items Found',
    desc: 'There are no items to display.',
    iconUrl: '/images/empty_list.svg',
  },
  errorChart: {
    title: 'Something Went Wrong',
    desc: ' Please ensure you have a stable internet connection\nand try refreshing the page.',
    iconUrl: '/images/error.svg',
  },
  emptyChart: {
    title: 'No Data Available',
    desc: null,
    iconUrl: '/images/empty_chart.svg',
  },
  emptyTable: {
    title: 'No Data Available',
    desc: 'There are no data available.',
    iconUrl: '/images/empty_table.svg',
  },
  emptyLink: {
    title: 'No Links Available',
    desc: 'There are no links available.',
    iconUrl: '/images/empty_link.svg',
  },
  noAuth: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: null,
    iconUrl: '/images/empty_authorization.svg',
  },
} as const;

export const CUSTOMIZED_EMPTY_CONTENT = {
  emptyGroup: {
    title: 'No Groups Yet',
    desc: 'It seems like there are no groups created yet.\nPlease create a new group or contact your administrator for assistance.',
    iconUrl: '/images/empty_group.svg',
  },
  emptyUser: {
    title: 'No Users Yet',
    desc: 'There are currently no users assigned to this group.\nInvite users to the group or check with your administrator if assistance is needed.',
    iconUrl: '/images/empty_user.svg',
  },
  emptyAdmin: {
    title: 'No Admin Available',
    desc: 'It seems like there are no admin added yet.\nPlease contact your administrator for assistance.',
    iconUrl: '/images/empty_user.svg',
  },
  emptyResource: {
    title: 'No Resources Yet',
    desc: 'No resources have been assigned to this group yet.\nPlease assign new resources or reach out to your administrator for help.',
    iconUrl: '/images/empty_link.svg',
  },
  emptyAssignedResource: {
    title: 'No Available Resources for Assignment',
    desc: 'There are currently no resources available for you to assign.',
    iconUrl: '/images/error.svg',
  },
  emptyAuthorization: {
    title: 'No Authorization Yet',
    desc: 'No authorization have been assigned to this organization yet.\nPlease add authorization to start your FinOps journey on LumiTure.ai!',
    iconUrl: '/images/empty_link.svg',
  },
  overviewNoAuthAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "Begin your cloud cost optimization journey by authorizing your first cloud account.\nAdd your cloud authorization to gain a comprehensive view of your organization's actual cloud spending,\nincluding a breakdown of costs by cloud provider, organizational spending rankings, and budget alerts.\nEasily identify cost-saving opportunities.",
    iconUrl: '/images/empty_authorization.svg',
  },
  overviewNoAuthNonAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "To kickstart your cloud cost optimization journey,\nplease reach out to your organization's administrator for authorization.\nAdd your cloud authorization to gain a comprehensive view of your organization's actual cloud spending,\nincluding a breakdown of costs by cloud provider, organizational spending rankings, and budget alerts.\nEasily identify cost-saving opportunities.",
    iconUrl: '/images/empty_authorization.svg',
  },
  dashboardNoAuthAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "Begin your cloud cost optimization journey by authorizing your cloud account.\nYou'll gain the flexibility to explore your organization's spending trends and details at various granularities.\nGroup data by different dimensions and filter to focus on specific cost areas of interest.\nEasily identify cost-saving opportunities.",
    iconUrl: '/images/empty_authorization.svg',
  },
  dashboardNoAuthNonAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "To kickstart your cloud cost optimization journey,\nplease reach out to your organization's administrator for authorization\nYou'll gain the flexibility to explore your organization's spending trends and details at various granularities.\nGroup data by different dimensions and filter to focus on specific cost areas of interest.\nEasily identify cost-saving opportunities.",
    iconUrl: '/images/empty_authorization.svg',
  },
  customizedBudgetNoAuthAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "Begin your cloud cost optimization journey by authorizing your cloud account.\nYou'll freely set budget amounts, customize alert notifications, and create your own rules based on your needs,\nkeeping you informed of your financial status anytime, anywhere.",
    iconUrl: '/images/empty_authorization.svg',
  },
  customizedBudgetNoAuthNonAdmin: {
    title: 'Unlock the Potential of Your Cloud Data Today',
    desc: "To kickstart your cloud cost optimization journey,\nplease reach out to your organization's administrator for authorization.\nYou'll freely set budget amounts, customize alert notifications, and create your own rules based on your needs,\nkeeping you informed of your financial status anytime, anywhere.",
    iconUrl: '/images/empty_authorization.svg',
  },
};
