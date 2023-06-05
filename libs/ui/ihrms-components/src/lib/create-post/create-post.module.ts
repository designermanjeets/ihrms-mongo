import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UiIhrmsDynamicFormsModule } from '@ihrms/ihrms-dynamic-forms';
import { CreatePostComponent } from './create-post.component';
import { CompanyNotificationsModule } from '../company-notifications/company-notifications.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    UiIhrmsDynamicFormsModule,
    IHRMSUtilityDirectiveModule,
    CompanyNotificationsModule,
    NgxUiLoaderModule
  ],
  declarations: [
    CreatePostComponent,
  ],
  exports: [
    CreatePostComponent
  ]
})
export class CreatePostModule {}
