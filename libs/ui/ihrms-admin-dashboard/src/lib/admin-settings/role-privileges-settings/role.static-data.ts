import { CONSTANTS } from '@ihrms/shared';
export const roleData =
  [
    {
      "module":"Admin",
      "sub_module": 'All Employees',
      "iconName":'manage_accounts',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ALL_EMPLOYEES}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Attendance',
      "iconName":'date_range',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ATTENDANCE}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Department',
      "iconName":'group_work',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_DEPARTMENTS}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Designation',
      "iconName":'assignment_ind',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_DESIGNATIONS}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Duty Roster',
      "iconName":'security',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_DUTY_ROSTER}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Leaves',
      "iconName":'event_note',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_LEAVES}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Holidays',
      "iconName":'holiday_village',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_HOLIDAYS}`,
      "isChild": true
    },
    {
      "module":"Admin",
      "sub_module": 'Timesheet',
      "iconName":'event_note',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_TIMESHEET}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'Attendance',
      "iconName": 'date_range',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_ATTENDANCE}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'Leaves',
      "iconName": 'event_note',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_LEAVES}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'My Documents',
      "iconName": 'attribution',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_MY_DOCOUMENTS}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'Expense Claim',
      "iconName": 'payment',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_EXPENSE_CLAIM}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'Finances',
      "iconName": 'recent_actors',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_FINANCES}`,
      "isChild": true
    },
    {
      "module":"User",
      "sub_module": 'Goals and Performance',
      "iconName": 'attribution',
      "url": `${CONSTANTS.EMP_DASHBOARD}/${CONSTANTS.EMP_GOALS_PERFORMANCE}`,
      "isChild": true
    },
    {
      "module":"Advance Reporting",
      "sub_module": '',
      "iconName": 'recent_actors',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ADV_REPORTING}`,
    },
    {
      "module":"Manage Documents",
      "sub_module": '',
      "iconName": 'recent_actors',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_MANAGE_DOCOUMENTS}`,
    },
    {
      "module":"Finance",
      "sub_module": 'Taxes',
      "iconName": 'recent_actors',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_FINANCES}`,
    },
    {
      "module":"Goals and Performance",
      "sub_module": '',
      "iconName": 'attribution',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_GOALS_PERFORMANCE}`,
      
    },
    {
      "module":"Jobs",
      "sub_module": 'Jobs',
      "iconName": 'work',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_JOBS}`,
    },
    {
      "module":"Companies",
      "sub_module": 'Company',
      "iconName": 'business',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_COMPANIES}`,
    },
    {
      "module":"Activity Logs",
      "sub_module": '',
      "iconName": 'article',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ACTIVITY_LOGS}`,
    },
    {
      "module":"Settings",
      "sub_module": 'Settings',
      "iconName": 'settings_applications',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_SETTINGS}`,
    },
    {
      "module":"Settings",
      "sub_module": 'company',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_COMPANY_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'masters',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_MASTERS_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'finances',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_FINANCE_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'salary',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_SALARY_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'shift',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_SHIFT_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'approval',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_APPROVAL_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'performance',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_PERFORMANCE_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'leave',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_LEAVE_LABEL}`,
      "isChild": true
    },
    {
      "module":"Settings",
      "sub_module": 'roles-privileges',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_ROLES_PRIVILEGES_LABEL}`,
      "isChild": true
    },
    {
      "module":"Expense Claim",
      "sub_module": 'Expense Claim',
      "iconName": 'payment',
      "url": `${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.ADMIN_EXPENSE_CLAIM}`,
    },
    {
      "module":"Payslips",
      "sub_module": '',
    }
  ]
