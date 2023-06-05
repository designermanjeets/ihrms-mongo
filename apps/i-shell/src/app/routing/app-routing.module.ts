import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { environment } from '../../environments/environment';
import { CONSTANTS } from '@ihrms/shared';
import { AuthGuard } from './auth.guard';
import { Role } from '@ihrms/auth';


const routes: Routes = [
  {
    path: CONSTANTS.LOGIN,
    loadChildren: () => import(`@ihrms/auth`).then(m => m.UiAuthModule),
    data: { environment: environment }
  },
  {
    path: CONSTANTS.ADMIN_DASHBOARD,
    loadChildren: () => import(`@ihrms/admin-dashboard`).then(m => m.UiIhrmsAdminDashboardModule),
    data: { environment: environment, roles: [Role.GONNGOD, Role.Admin] },
    canActivate: [AuthGuard],
  },
  {
    path: CONSTANTS.EMP_DASHBOARD,
    loadChildren: () => import(`@ihrms/emp-dashboard`).then(m => m.UiIhrmsEmpDashboardModule),
    data: { environment: environment, roles: [Role.GONNGOD, Role.Admin, Role.Employee] },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: CONSTANTS.LOGIN,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
