import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ihrms-grid-simple-list',
  templateUrl: './grid-simple-list.component.html',
  styleUrls: ['./grid-simple-list.component.scss']
})
export class GridSimpleListComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
