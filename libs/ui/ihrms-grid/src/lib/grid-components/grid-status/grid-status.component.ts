import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ihrms-grid-status',
  templateUrl: './grid-status.component.html',
  styleUrls: ['./grid-status.component.scss']
})
export class GridStatusComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
