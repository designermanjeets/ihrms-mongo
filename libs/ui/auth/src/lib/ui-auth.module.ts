import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UiSharedModule } from '@ihrms/shared';
import { RouterModule, Routes } from '@angular/router';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { ToastrModule } from 'ngx-toastr';
import { Safe } from './_helpers/auth.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ApolloModule } from 'apollo-angular';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'changepwd',
    component: ChangePwdComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'prefix',
  },
];

@NgModule({
  imports: [
    CommonModule,
    UiSharedModule,
    RouterModule.forChild(appRoutes),
    NgxUsefulSwiperModule,
    ToastrModule,
    NgxUiLoaderModule,
    ApolloModule,
  ],
  declarations: [LoginComponent, Safe, ChangePwdComponent],
})
export class UiAuthModule {}
