import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { IhrmsGridComponent } from './ihrms-grid/ihrms-grid.component';
import { GridActionComponent } from './grid-components/grid-action/grid-action.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IHRMSUtilityDirectiveModule } from '@ihrms/shared';
import { MatCardModule } from '@angular/material/card';
import { ReqCorrectionComponent } from './grid-components/req-correction/req-correction.component';
import { GridStatusComponent } from './grid-components/grid-status/grid-status.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GridAvatarComponent } from './grid-components/grid-avatar/grid-avatar.component';
import { GridSimpleListComponent } from './grid-components/grid-simple-list/grid-simple-list.component';
import { GridCheckBoxComponent } from './grid-components/grid-check-box/grid-check-box.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { IdApiValueComponent } from './grid-components/id-api-value/id-api-value.component';
import { CustomHeaderComponent } from './ihrms-grid/custom-header.component';
import { GridTimezoneComponent } from './grid-components/grid-timezone/grid-timezone.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { RichSelectCellRendererComponent } from './grid-components/rich-select-cell-renderer/rich-select-cell-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    IHRMSUtilityDirectiveModule,
    NgxUiLoaderModule,
    MatMenuModule,
  ],
  declarations: [
    IhrmsGridComponent,
    GridActionComponent,
    ReqCorrectionComponent,
    GridStatusComponent,
    GridAvatarComponent,
    GridSimpleListComponent,
    GridCheckBoxComponent,
    IdApiValueComponent,
    CustomHeaderComponent,
    GridTimezoneComponent,
    RichSelectCellRendererComponent,
  ],
  exports: [IhrmsGridComponent, MatChipsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiIhrmsGridModule {}
