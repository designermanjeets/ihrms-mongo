import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { OnDutyRequestsComponent } from './on-duty-requests.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UiIhrmsDynamicFormsModule } from '@ihrms/ihrms-dynamic-forms';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    UiIhrmsDynamicFormsModule,
    IHRMSUtilityDirectiveModule
  ],
  declarations: [
    OnDutyRequestsComponent,
  ],
  exports: [
    OnDutyRequestsComponent
  ]
})
export class OnDutyRequestsModule {}
