import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CONSTANTS, UiSharedModule } from '@ihrms/shared';
import { MyProfileWrapComponent } from './my-profile-wrap/my-profile-wrap.component';
import {
  CreatePostModule,
  IhrmsFiltersModule,
  MultiChartsModule,
  MyProfileModule,
  TodaysInoutModule,
  MyOrgModule,
} from '@ihrms/ihrms-components';
import { CreateEmpPostComponent } from './create-emp-post/create-emp-post.component';
import { UiIhrmsGridsterModule } from '@ihrms/ihrms-gridster';
import { EmpDashboardComponent } from './emp-dashboard/emp-dashboard.component';
import { EmpAttendanceComponent } from './emp-attendance/emp-attendance.component';
import { UiIhrmsGridModule } from '@ihrms/ihrms-grid';
import { EmpAttendanceDetailsComponent } from './emp-attendance/emp-attendance-details/emp-attendance-details.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { EmpFinancesComponent } from './emp-finances/emp-finances.component';
import { EmpFinancesDetailsComponent } from './emp-finances/emp-finances-details/emp-finances-details.component';
import { EmpLeavesComponent } from './emp-leaves/emp-leaves.component';
import { EmpLeavesDetailsComponent } from './emp-leaves/emp-leaves-details/emp-leaves-details.component';
import { EmpExpClaimComponent } from './emp-exp-claim/emp-exp-claim.component';
import { EmpExpClaimDetailsComponent } from './emp-exp-claim/emp-exp-claim-details/emp-exp-claim-details.component';
import { MyOrgWrapComponent } from './my-org-wrap/my-org-wrap.component';
import { authInterceptorProviders } from '@ihrms/auth';
import { AgmCoreModule } from '@agm/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { EmpGoalsPerforaComponent } from './emp-goals-perfora/emp-goals-perfora.component';
import { EmpGoalsPerforaDetailsComponent } from './emp-goals-perfora/emp-goals-perfora-details/emp-goals-perfora-details.component';
import { EmpMyDocumentsComponent } from './emp-my-documents/emp-my-documents.component';

const appRoutes: Routes = [
  {
    path: CONSTANTS.EMPTY,
    component: EmpDashboardComponent,
  },
  {
    path: CONSTANTS.MY_PROFILE,
    component: MyProfileWrapComponent,
  },
  {
    path: CONSTANTS.CREATE_POST,
    component: CreateEmpPostComponent,
  },
  {
    path: CONSTANTS.EMP_ATTENDANCE,
    component: EmpAttendanceComponent,
  },
  {
    path: CONSTANTS.EMP_ATTENDANCE_DETAILS,
    component: EmpAttendanceDetailsComponent,
  },
  {
    path: CONSTANTS.EMP_FINANCES,
    component: EmpFinancesComponent,
  },
  {
    path: CONSTANTS.EMP_FINANCES_DETAILS,
    component: EmpFinancesDetailsComponent,
  },
  {
    path: CONSTANTS.EMP_GOALS_PERFORMANCE,
    component: EmpGoalsPerforaComponent,
  },
  {
    path: CONSTANTS.EMP_GOALS_PERFORMANCE_DETAILS,
    component: EmpGoalsPerforaDetailsComponent,
  },
  {
    path: CONSTANTS.EMP_LEAVES,
    component: EmpLeavesComponent,
  },
  {
    path: CONSTANTS.EMP_LEAVES_DETAILS,
    component: EmpLeavesDetailsComponent,
  },
  {
    path: CONSTANTS.EMP_MY_DOCOUMENTS,
    component: EmpMyDocumentsComponent,
  },
  {
    path: CONSTANTS.EMP_EXPENSE_CLAIM,
    component: EmpExpClaimComponent,
  },
  {
    path: CONSTANTS.EMP_EXPENSE_CLAIM_DETAILS,
    component: EmpExpClaimDetailsComponent,
  },
  {
    path: CONSTANTS.EMP_MY_ORG,
    component: MyOrgWrapComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiSharedModule,
    RouterModule.forChild(appRoutes),
    MyProfileModule,
    CreatePostModule,
    TodaysInoutModule,
    MultiChartsModule,
    UiIhrmsGridModule,
    MatButtonToggleModule,
    MatTabsModule,
    UiIhrmsGridsterModule,
    IhrmsFiltersModule,
    MyOrgModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGg6E3Q4QK4SaqPemB8c5tNx-ikzBUyvo',
    }),
    NgxUiLoaderModule,
  ],
  declarations: [
    MyProfileWrapComponent,
    CreateEmpPostComponent,
    EmpDashboardComponent,
    EmpAttendanceComponent,
    EmpAttendanceDetailsComponent,
    EmpFinancesComponent,
    EmpFinancesDetailsComponent,
    EmpLeavesComponent,
    EmpLeavesDetailsComponent,
    EmpExpClaimComponent,
    EmpExpClaimDetailsComponent,
    MyOrgWrapComponent,
    EmpGoalsPerforaComponent,
    EmpGoalsPerforaDetailsComponent,
    EmpMyDocumentsComponent,
  ],
  providers: [authInterceptorProviders],
})
export class UiIhrmsEmpDashboardModule {}
