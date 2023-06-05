import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CONSTANTS } from '@ihrms/shared';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { CreateEmployeeWrapComponent } from '../create-employee-wrap/create-employee-wrap.component';
import { CreateAdminPostComponent } from '../create-admin-post/create-admin-post.component';
import { AdminAttendanceComponent } from '../admin-attendance/admin-attendance.component';
import { AdminAttendanceDetailsComponent } from '../admin-attendance/admin-attendance-details/admin-attendance-details.component';
import { AdminFinancesComponent } from '../admin-finances/admin-finances.component';
import { AdminFinancesDetailsComponent } from '../admin-finances/admin-finances-details/admin-finances-details.component';
import { AdminLeavesComponent } from '../admin-leaves/admin-leaves.component';
import { AdminLeavesDetailsComponent } from '../admin-leaves/admin-leaves-details/admin-leaves-details.component';
import { AdminExpClaimComponent } from '../admin-exp-claim/admin-exp-claim.component';
import { AdminExpClaimDetailsComponent } from '../admin-exp-claim/admin-exp-claim-details/admin-exp-claim-details.component';
import { AdminEmployeesComponent } from '../admin-employees/admin-employees.component';
import { AdminDepartmentsComponent } from '../admin-departments/admin-departments.component';
import { AdminHolidaysComponent } from '../admin-holidays/admin-holidays.component';
import { AdminTimesheetsComponent } from '../admin-timesheets/admin-timesheets.component';
import { AdminCompaniesComponent } from '../admin-companies/admin-companies.component';
import { AdminSettingsComponent } from '../admin-settings/admin-settings.component';
import { SalarySettingsComponent } from '../admin-settings/salary-settings/salary-settings.component';
import { GeneralSettingsComponent } from '../admin-settings/general-settings/general-settings.component';
import { ApprovalSettingsComponent } from '../admin-settings/approval-settings/approval-settings.component';
import { PerformanceSettingsComponent } from '../admin-settings/performance-settings/performance-settings.component';
import { LeaveSettingsComponent } from '../admin-settings/leave-settings/leave-settings.component';
import { RolePrivilegesSettingsComponent } from '../admin-settings/role-privileges-settings/role-privileges-settings.component';
import { AdminJobsComponent } from '../admin-jobs/admin-jobs.component';
import { AdminJobsDashboardComponent } from '../admin-jobs/admin-jobs-dashboard/admin-jobs-dashboard.component';
import { AdminCandidatesDashboardComponent } from '../admin-jobs/admin-candidates-dashboard/admin-candidates-dashboard.component';
import { AdminCandidatesDashboardDetailsComponent } from '../admin-jobs/admin-candidates-dashboard/admin-candidates-dashboard-details/admin-candidates-dashboard-details.component';
import { AdminJobsDashboardDetailsComponent } from '../admin-jobs/admin-jobs-dashboard/admin-jobs-dashboard-details/admin-jobs-dashboard-details.component';
import { OtherMastersComponent } from '../other-masters/other-masters.component';
import { AdminDesignationsComponent } from '../admin-designations/admin-designations.component';
import { ShiftScheduleComponent } from '../admin-settings/shift-schedule/shift-schedule.component';
import { AdminDashbaordAllComponent } from '../admin-dashbaord-all/admin-dashbaord-all.component';
import { FinancesSettingsComponent } from '../admin-settings/finances-settings/finances-settings.component';
import { AdminMyProfileComponent } from '../admin-my-profile/admin-my-profile.component';
import { AdminDutyRosterComponent } from '../admin-duty-roster/admin-duty-roster.component';
import { AdminActivityLogsComponent } from '../admin-activity-logs/admin-activity-logs.component';
import { AdminGoalsPerforaComponent } from '../admin-goals-perfora/admin-goals-perfora.component';
import { AdminGoalsPerforaDetailsComponent } from '../admin-goals-perfora/admin-goals-perfora-details/admin-goals-perfora-details.component';
import { AdminAdvReportingComponent } from '../admin-adv-reporting/admin-adv-reporting.component';
import { AdminManageDocumentsComponent } from '../admin-manage-documents/admin-manage-documents.component';


const routes: Routes = [
  {
    path: CONSTANTS.EMPTY,
    component: AdminDashboardComponent
  },
  {
    path: CONSTANTS.MY_PROFILE,
    component: AdminMyProfileComponent
  },
  {
    path: CONSTANTS.CREATE_PROFILE,
    component: CreateEmployeeWrapComponent
  },
  {
    path: CONSTANTS.CREATE_POST,
    component: CreateAdminPostComponent
  },
  {
    path: CONSTANTS.ADMIN_ATTENDANCE,
    component: AdminAttendanceComponent
  },
  {
    path: CONSTANTS.ADMIN_ATTENDANCE_DETAILS,
    component: AdminAttendanceDetailsComponent
  },
  {
    path: CONSTANTS.ADMIN_FINANCES,
    component: AdminFinancesComponent
  },
  {
    path: CONSTANTS.ADMIN_FINANCES_DETAILS,
    component: AdminFinancesDetailsComponent
  },
  {
    path: CONSTANTS.ADMIN_MANAGE_DOCOUMENTS,
    component: AdminManageDocumentsComponent
  },
  {
    path: CONSTANTS.ADMIN_ADV_REPORTING,
    component: AdminAdvReportingComponent
  },
  {
    path: CONSTANTS.ADMIN_GOALS_PERFORMANCE,
    component: AdminGoalsPerforaComponent
  },
  {
    path: CONSTANTS.ADMIN_GOALS_PERFORMANCE_DETAILS,
    component: AdminGoalsPerforaDetailsComponent
  },
  {
    path: CONSTANTS.ADMIN_LEAVES,
    component: AdminLeavesComponent
  },
  {
    path: CONSTANTS.ADMIN_LEAVES_DETAILS,
    component: AdminLeavesDetailsComponent
  },
  {
    path: CONSTANTS.ADMIN_EXPENSE_CLAIM,
    component: AdminExpClaimComponent
  },
  {
    path: CONSTANTS.ADMIN_EXPENSE_CLAIM_DETAILS,
    component: AdminExpClaimDetailsComponent
  },
  {
    path: CONSTANTS.ADMIN_ALL_EMPLOYEES,
    component: AdminEmployeesComponent
  },
  {
    path: CONSTANTS.ADMIN_DEPARTMENTS,
    component: AdminDepartmentsComponent
  },
  {
    path: CONSTANTS.ADMIN_DESIGNATIONS,
    component: AdminDesignationsComponent
  },
  {
    path: CONSTANTS.ADMIN_DUTY_ROSTER,
    component: AdminDutyRosterComponent
  },
  {
    path: CONSTANTS.ADMIN_HOLIDAYS,
    component: AdminHolidaysComponent
  },
  {
    path: CONSTANTS.ADMIN_TIMESHEET,
    component: AdminTimesheetsComponent
  },
  {
    path: CONSTANTS.ADMIN_JOBS,
    component: AdminJobsComponent,
    children: [
      { path: '', redirectTo: CONSTANTS.ADMIN_CANDIDATES_DASHBOARD, pathMatch: CONSTANTS.PREFIX },
      {
        path: CONSTANTS.ADMIN_CANDIDATES_DASHBOARD,
        component: AdminCandidatesDashboardComponent
      },
      {
        path: CONSTANTS.ADMIN_CANDIDATES_DASHBOARD_DETAILS,
        component: AdminCandidatesDashboardDetailsComponent
      },
      {
        path: CONSTANTS.ADMIN_JOBS_DASHBOARD,
        component: AdminJobsDashboardComponent
      },
      {
        path: CONSTANTS.ADMIN_JOBS_DASHBOARD_DETAILS,
        component: AdminJobsDashboardDetailsComponent
      },
    ]
  },
  {
    path: CONSTANTS.ADMIN_COMPANIES,
    component: AdminCompaniesComponent
  },
  {
    path: CONSTANTS.ADMIN_ACTIVITY_LOGS,
    component: AdminActivityLogsComponent
  },
  {
    path: CONSTANTS.DASHBOARD_ALL,
    component: AdminDashbaordAllComponent
  },
  {
    path: CONSTANTS.ADMIN_SETTINGS,
    component: AdminSettingsComponent,
    children: [
      { path: CONSTANTS.EMPTY, redirectTo: CONSTANTS.ADMIN_COMPANY_PATH, pathMatch: CONSTANTS.PREFIX },
      { path: CONSTANTS.ADMIN_COMPANY_PATH, component: GeneralSettingsComponent, data: { label: CONSTANTS.ADMIN_COMPANY_LABEL } }, // Was General Before
      { path: CONSTANTS.ADMIN_MASTERS_PATH, component: OtherMastersComponent, data: { label: CONSTANTS.ADMIN_MASTERS_LABEL } }, // Was Other Master Before
      { path: CONSTANTS.ADMIN_FINANCE_PATH, component: FinancesSettingsComponent, data: { label: CONSTANTS.ADMIN_FINANCE_LABEL } },
      { path: CONSTANTS.ADMIN_SALARY_PATH, component: SalarySettingsComponent, data: { label: CONSTANTS.ADMIN_SALARY_LABEL } },
      { path: CONSTANTS.ADMIN_SHIFT_PATH, component: ShiftScheduleComponent, data: { label: CONSTANTS.ADMIN_SHIFT_LABEL } },
      { path: CONSTANTS.ADMIN_APPROVAL_PATH, component: ApprovalSettingsComponent, data: { label: CONSTANTS.ADMIN_APPROVAL_LABEL } },
      { path: CONSTANTS.ADMIN_PERFORMANCE_PATH, component: PerformanceSettingsComponent, data: { label: CONSTANTS.ADMIN_PERFORMANCE_LABEL } },
      { path: CONSTANTS.ADMIN_LEAVE_PATH, component: LeaveSettingsComponent, data: { label: CONSTANTS.ADMIN_LEAVE_LABEL } },
     { path: CONSTANTS.ADMIN_ROLES_PRIVILEGES_PATH, component: RolePrivilegesSettingsComponent, data: { label: CONSTANTS.ADMIN_ROLES_PRIVILEGES_LABEL } },
      // { path: CONSTANTS.ADMIN_CRON_JOB_PATH, component: CronSettingsComponent, data: { label: CONSTANTS.ADMIN_CRON_JOB_LABEL } },
    ]
  },
  {
    path: CONSTANTS.EMPTY,
    redirectTo: CONSTANTS.EMPTY,
    pathMatch: CONSTANTS.PREFIX
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
