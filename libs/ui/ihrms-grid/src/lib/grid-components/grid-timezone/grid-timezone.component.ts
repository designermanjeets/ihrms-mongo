import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CONSTANTS } from '@ihrms/shared';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';

@Component({
  selector: 'ihrms-grid-timezone',
  templateUrl: './grid-timezone.component.html',
  styleUrls: ['./grid-timezone.component.scss']
})
export class GridTimezoneComponent implements ICellRendererAngularComp {

  public params: any;
  public cellValue!: string;

  agInit(params: any): void {
    this.params = params;
    const local = new Date(params.data?.date + 'Z');
    const new_local = moment(local).add(params.value, 'hours');
    this.cellValue = new_local.format('hh:mm:ss a');
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
