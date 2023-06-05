import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-req-correction',
  templateUrl: './req-correction.component.html',
  styleUrls: ['./req-correction.component.scss']
})
export class ReqCorrectionComponent implements ICellRendererAngularComp {

  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  requestCorrection($event: any) {
    $event.stopPropagation();
    this.params.action({ action: CONSTANTS.REQUEST_CORRECTION, data: this.params, text: 'Request Correction' });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }


}
