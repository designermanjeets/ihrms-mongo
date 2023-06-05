import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-grid-check-box',
  templateUrl: './grid-check-box.component.html',
  styleUrls: ['./grid-check-box.component.scss']
})
export class GridCheckBoxComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    params.value === 'true' && (params.value = true);
    params.value === 'false' && (params.value = false);
    params.data[params.column.colId] === 'true' && (params.data[params.column.colId] = true);
    params.data[params.column.colId] === 'false' && (params.data[params.column.colId] = false);
    this.params = params;
  }

  onModelChange(event: any) {
    this.params?.action({
      action: CONSTANTS.CHECKBOX_CHANGED,
      data: this.params,
      parent: this.params?.node?.parent,
      text: CONSTANTS.CHECKBOX_CHANGED,
      checked: event
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
