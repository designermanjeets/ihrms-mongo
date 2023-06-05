import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IhrmsListItemsComponent } from './ihrms-list-items.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatListModule,
    MatDividerModule,
    MatIconModule
  ],
  declarations: [
    IhrmsListItemsComponent,
  ],
  exports: [
    IhrmsListItemsComponent
  ]
})
export class IhrmsListItemsModule {}
