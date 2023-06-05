import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ihrms-rich-select-cell-renderer',
  templateUrl: './rich-select-cell-renderer.component.html',
  styleUrls: ['./rich-select-cell-renderer.component.scss'],
})
export class RichSelectCellRendererComponent implements ICellRendererAngularComp {

  public params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh() {
    return false;
  }
}
