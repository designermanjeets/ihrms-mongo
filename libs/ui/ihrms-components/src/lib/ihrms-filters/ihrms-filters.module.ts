import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IhrmsFiltersComponent } from './ihrms-filters.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    IHRMSUtilityDirectiveModule,
    NgxUploaderModule,
    FormsModule
  ],
  declarations: [
    IhrmsFiltersComponent,
  ],
  exports: [
    IhrmsFiltersComponent
  ]
})
export class IhrmsFiltersModule {}
