import { ProfileMenuItems } from '@ihrms/ihrms-navbar';
import { CONSTANTS } from '@ihrms/shared';

export const profileMenuItemsEmp: ProfileMenuItems[] = [
  { id: CONSTANTS.MY_PROFILE ,icon: 'account_circle', text: 'Profile' },
  { id: CONSTANTS.ADMIN_DASHBOARD ,icon: 'admin_panel_settings', text: 'Admin' },
  { id: CONSTANTS.CREATE_POST ,icon: 'post_add', text: 'Posts' },
  { id: CONSTANTS.LOGOUT ,icon: 'logout', text: 'LogOut' }
];

export const profileMenuItemsAdmin: ProfileMenuItems[] = [
  { id: CONSTANTS.MY_PROFILE ,icon: 'account_circle', text: 'Profile' },
  { id: CONSTANTS.EMP_DASHBOARD ,icon: 'manage_accounts', text: 'Employee' },
  { id: CONSTANTS.CREATE_POST ,icon: 'post_add', text: 'Posts' },
  { id: CONSTANTS.LOGOUT ,icon: 'logout', text: 'LogOut' }
];
