/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSharedModule } from '@ihrms/shared';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UiIhrmsGridsterModule } from '@ihrms/ihrms-gridster';
import { CreateEmployeeWrapComponent } from './create-employee-wrap/create-employee-wrap.component';
import {
  CreatePostModule,
  IhrmsDashboardAllModule,
  IhrmsFiltersModule,
  MyProfileModule,
} from '@ihrms/ihrms-components';
import { CreateAdminPostComponent } from './create-admin-post/create-admin-post.component';
import { AdminAttendanceComponent } from './admin-attendance/admin-attendance.component';
import { AdminAttendanceDetailsComponent } from './admin-attendance/admin-attendance-details/admin-attendance-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminFinancesComponent } from './admin-finances/admin-finances.component';
import { AdminFinancesDetailsComponent } from './admin-finances/admin-finances-details/admin-finances-details.component';
import { AdminLeavesComponent } from './admin-leaves/admin-leaves.component';
import { AdminLeavesDetailsComponent } from './admin-leaves/admin-leaves-details/admin-leaves-details.component';
import { AdminExpClaimComponent } from './admin-exp-claim/admin-exp-claim.component';
import { AdminExpClaimDetailsComponent } from './admin-exp-claim/admin-exp-claim-details/admin-exp-claim-details.component';
import { AdminEmployeesComponent } from './admin-employees/admin-employees.component';
import { AdminDepartmentsComponent } from './admin-departments/admin-departments.component';
import { AdminHolidaysComponent } from './admin-holidays/admin-holidays.component';
import { AdminTimesheetsComponent } from './admin-timesheets/admin-timesheets.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminCompaniesComponent } from './admin-companies/admin-companies.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminRoutingModule } from './routing/admin-routing.module';
import { SalarySettingsComponent } from './admin-settings/salary-settings/salary-settings.component';
import { UiIhrmsDynamicFormsModule } from '@ihrms/ihrms-dynamic-forms';
import { UiIhrmsGridModule } from '@ihrms/ihrms-grid';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';

import { GeneralSettingsComponent } from './admin-settings/general-settings/general-settings.component';
import { SystemSettingsComponent } from './admin-settings/system-settings/system-settings.component';
import { ApprovalSettingsComponent } from './admin-settings/approval-settings/approval-settings.component';
import { PerformanceSettingsComponent } from './admin-settings/performance-settings/performance-settings.component';
import { LeaveSettingsComponent } from './admin-settings/leave-settings/leave-settings.component';
import { RolePrivilegesSettingsComponent } from './admin-settings/role-privileges-settings/role-privileges-settings.component';
import { CronSettingsComponent } from './admin-settings/cron-settings/cron-settings.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AdminJobsComponent } from './admin-jobs/admin-jobs.component';
import { AdminJobsDashboardComponent } from './admin-jobs/admin-jobs-dashboard/admin-jobs-dashboard.component';
import { AdminJobsDashboardDetailsComponent } from './admin-jobs/admin-jobs-dashboard/admin-jobs-dashboard-details/admin-jobs-dashboard-details.component';
import { AdminCandidatesDashboardComponent } from './admin-jobs/admin-candidates-dashboard/admin-candidates-dashboard.component';
import { AdminCandidatesDashboardDetailsComponent } from './admin-jobs/admin-candidates-dashboard/admin-candidates-dashboard-details/admin-candidates-dashboard-details.component';
import { UiIhrmsQueryBuilderModule } from '@ihrms/ihrms-query-builder';
import { OtherMastersComponent } from './other-masters/other-masters.component';
import { AdminDesignationsComponent } from './admin-designations/admin-designations.component';
import { EmployeeTypeComponent } from './other-masters/employee-type/employee-type.component';
import { BloodGroupComponent } from './other-masters/blood-group/blood-group.component';
import { CastComponent } from './other-masters/cast/cast.component';
import { MaritalStatusComponent } from './other-masters/marital-status/marital-status.component';
import { ModeOfEmploymentComponent } from './other-masters/mode-of-employment/mode-of-employment.component';
import { RelationComponent } from './other-masters/relation/relation.component';
import { StatusComponent } from './other-masters/status/status.component';
import { TitleComponent } from './other-masters/title/title.component';
import { authInterceptorProviders } from '@ihrms/auth';
import { ShiftTypeComponent } from './other-masters/shift-type/shift-type.component';
import { JobTitleComponent } from './other-masters/job-title/job-title.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShiftScheduleComponent } from './admin-settings/shift-schedule/shift-schedule.component';
import { PayHeadComponent } from './admin-settings/salary-settings/pay-head/pay-head.component';
import { PayFormulaComponent } from './admin-settings/salary-settings/pay-formula/pay-formula.component';
import { SalaryStructureComponent } from './admin-settings/salary-settings/salary-structure/salary-structure.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminDashbaordAllComponent } from './admin-dashbaord-all/admin-dashbaord-all.component';
import { CompanyProfileComponent } from './admin-settings/general-settings/company-profile/company-profile.component';
import { CompanyEpfComponent } from './admin-settings/general-settings/company-epf/company-epf.component';
import { CompanyEsiComponent } from './admin-settings/general-settings/company-esi/company-esi.component';
import { CompanyProfTaxComponent } from './admin-settings/general-settings/company-prof-tax/company-prof-tax.component';
import { CompanyTaxComponent } from './admin-settings/general-settings/company-tax/company-tax.component';
import { CompanyTemplatesComponent } from './admin-settings/general-settings/company-templates/company-templates.component';
import { CompanyLabourWelfareFundComponent } from './admin-settings/general-settings/company-labour-welfare-fund/company-labour-welfare-fund.component';
import { PayScheduleComponent } from './admin-settings/salary-settings/pay-schedule/pay-schedule.component';
import { FinancesSettingsComponent } from './admin-settings/finances-settings/finances-settings.component';
import { FlexiBenefitsComponent } from './admin-settings/finances-settings/flexi-benefits/flexi-benefits.component';
import { ReimbursementClaimsComponent } from './admin-settings/finances-settings/reimbursement-claims/reimbursement-claims.component';
import { ItDeclarationsComponent } from './admin-settings/finances-settings/it-declarations/it-declarations.component';
import { ProofOfInvestmentsComponent } from './admin-settings/finances-settings/proof-of-investments/proof-of-investments.component';
import { AdminMyProfileComponent } from './admin-my-profile/admin-my-profile.component';
import { AdminDutyRosterComponent } from './admin-duty-roster/admin-duty-roster.component';
import { EmployeePayComponent } from './admin-settings/salary-settings/employee-pay/employee-pay.component';
import { AdminActivityLogsComponent } from './admin-activity-logs/admin-activity-logs.component';
import { AdminGoalsPerforaComponent } from './admin-goals-perfora/admin-goals-perfora.component';
import { AdminGoalsPerforaDetailsComponent } from './admin-goals-perfora/admin-goals-perfora-details/admin-goals-perfora-details.component';
import { SalaryEditComponent } from './admin-finances/salary-edit/salary-edit.component';
import { SalaryEditComponentRevisions } from './admin-finances/salary-edit-revisions/salary-edit-revisions.component';
import { AdminAdvReportingComponent } from './admin-adv-reporting/admin-adv-reporting.component';
import { AdminManageDocumentsComponent } from './admin-manage-documents/admin-manage-documents.component';

@NgModule({
  imports: [
    CommonModule,
    UiSharedModule,
    UiIhrmsGridsterModule,
    MyProfileModule,
    CreatePostModule,
    MatTabsModule,
    IhrmsFiltersModule,
    AdminRoutingModule,
    UiIhrmsDynamicFormsModule,
    UiIhrmsGridModule,
    UiIhrmsQueryBuilderModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDialogModule,
    NgxUiLoaderModule,
    DragDropModule,
    IhrmsDashboardAllModule,
    SpreadsheetAllModule,
  ],
  declarations: [
    AdminDashboardComponent,
    CreateEmployeeWrapComponent,
    CreateAdminPostComponent,
    AdminAttendanceComponent,
    AdminAttendanceDetailsComponent,
    AdminFinancesComponent,
    AdminFinancesDetailsComponent,
    AdminLeavesComponent,
    AdminLeavesDetailsComponent,
    AdminExpClaimComponent,
    AdminExpClaimDetailsComponent,
    AdminEmployeesComponent,
    AdminDepartmentsComponent,
    AdminHolidaysComponent,
    AdminTimesheetsComponent,
    AdminUsersComponent,
    AdminCompaniesComponent,
    AdminSettingsComponent,
    SalarySettingsComponent,
    GeneralSettingsComponent,
    SystemSettingsComponent,
    ApprovalSettingsComponent,
    PerformanceSettingsComponent,
    LeaveSettingsComponent,
    RolePrivilegesSettingsComponent,
    CronSettingsComponent,
    AdminJobsComponent,
    AdminJobsDashboardComponent,
    AdminCandidatesDashboardComponent,
    AdminCandidatesDashboardDetailsComponent,
    AdminJobsDashboardDetailsComponent,
    OtherMastersComponent,
    AdminDesignationsComponent,
    EmployeeTypeComponent,
    BloodGroupComponent,
    CastComponent,
    MaritalStatusComponent,
    ModeOfEmploymentComponent,
    RelationComponent,
    StatusComponent,
    TitleComponent,
    ShiftTypeComponent,
    JobTitleComponent,
    ShiftScheduleComponent,
    PayHeadComponent,
    PayFormulaComponent,
    SalaryStructureComponent,
    AdminDashbaordAllComponent,
    CompanyProfileComponent,
    CompanyEpfComponent,
    CompanyEsiComponent,
    CompanyProfTaxComponent,
    CompanyTaxComponent,
    CompanyTemplatesComponent,
    CompanyLabourWelfareFundComponent,
    PayScheduleComponent,
    FinancesSettingsComponent,
    FlexiBenefitsComponent,
    ReimbursementClaimsComponent,
    ItDeclarationsComponent,
    ProofOfInvestmentsComponent,
    AdminMyProfileComponent,
    AdminDutyRosterComponent,
    EmployeePayComponent,
    AdminActivityLogsComponent,
    AdminGoalsPerforaComponent,
    AdminGoalsPerforaDetailsComponent,
    SalaryEditComponent,
    SalaryEditComponentRevisions,
    AdminAdvReportingComponent,
    AdminManageDocumentsComponent,
  ],
  providers: [authInterceptorProviders],
})
export class UiIhrmsAdminDashboardModule {}
