export const EVENT = {
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  INVITE_ADMIN: 'invite_admin',
} as const;

export const EVENT_OVERVIEW = {
  SCREENSHOT: 'OV_screenshot',
  DISPLAY_FREQ: 'OV_display_freq',
  CLICK_FULL_RANK: 'OV_click_full_rank',
} as const;

export const EVENT_FULL_RANK = {
  SCREENSHOT: 'FR_screenshot',
  DISPLAY_FREQ: 'FR_display_freq',
} as const;

export const EVENT_EXECUTIVE_INSIGHTS = {
  SCREENSHOT: 'EX_screenshot',
} as const;

export const EVENT_ANOMALY_DETECTION_REPORT = {
  SCREENSHOT: 'AD_screenshot',
} as const;

export const EVENT_UI = {
  SIDEBAR_DISPLAY: 'UI_sidebar_display',
  FOOTER_FEEDBACK: 'UI_footer_feedback',
} as const;

export const EVENT_COST_DASHBOARD = {
  CLICK_PLATFORM_TAB: 'CD_click_platform_tab',
  SELECT_DATE: 'CD_select_date',
  CLICK_DOWNLOAD_CSV: 'CD_click_download_csv',
  CLICK_FILTER_RESET: 'CD_click_filter_reset',
  CLICK_FILTER_APPLY: 'CD_click_filter_apply',
} as const;

export const EVENT_GROUP_LIST = {
  CLICK_CHECK_T1_RESOURCE: 'GL_click_check_T1_resource',
  CLICK_CHECK_T1_T2GROUP: 'GL_click_check_T1_T2group',
  CLICK_CREATE_GROUP: 'GL_click_create_group',
  CLICK_SAVE_CREATED_GROUP: 'GL_click_save_created_group',
  CLICK_ASSIGN_RESOURCE: 'GL_click_assign_resource',
  CLICK_EDIT_RESOURCE: 'GL_click_edit_resource',
  CLICK_UNLINK_RESOURCE: 'GL_click_unlink_resource',
} as const;

export const EVENT_RESOURCE_LIST = {
  CLICK_ADD_RESOURCE: 'RL_click_add_resource',
  CLICK_PLATFORM_TAB: 'RL_click_platform_tab',
  CLICK_GO_RESOURCE_FORM: 'RL_click_go_resource_form',
  CLICK_SUBMIT_RESOURCE: 'RL_click_submit_resource',
  COPY_RESOURCE_INFO: 'RL_copy_resource_info',
} as const;
