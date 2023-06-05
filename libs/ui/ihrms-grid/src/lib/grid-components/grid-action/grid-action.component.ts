import { Component } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CONSTANTS } from '@ihrms/shared';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ihrms-grid-action',
  templateUrl: './grid-action.component.html',
  styleUrls: ['./grid-action.component.scss']
})
export class GridActionComponent implements ICellRendererAngularComp {

  public params: any;
  public paramsVal: any;
  public isDisabled: any = [];

  public isSlideChecked = false;

  agInit(params: any): void {
    if(params.type === CONSTANTS.REQUEST_LEAVE || params.type === CONSTANTS.REQUEST_ATTENDANCE || params.type === CONSTANTS.REQUEST) {
      if(params.data.status === CONSTANTS.Approved || params.data.status === CONSTANTS.Rejected || params.data.status === CONSTANTS.Recalled || params.data.status === CONSTANTS.Released || params.data.status === CONSTANTS.Declined || params.data.isAllowedForAction === false) { //  || params.data.status === CONSTANTS.Hold
        params.value.actionBtn?.forEach((_: any) => this.isDisabled.push(true) );
        params.value.names?.forEach((_: any) => this.isDisabled.push(true) );
      } else {
        params.value.actionBtn?.forEach((_: any) => this.isDisabled.push(false) );
        params.value.names?.forEach((_: any) => this.isDisabled.push(false) );
      }
      if(params.data.status === CONSTANTS.Hold) {
        params.value.names?.forEach((btn: any, idx: number) => {
          if(btn === CONSTANTS.Hold) {
            this.isDisabled[idx] = true;
          }
        });
      }
    }
    this.params = params;
    this.paramsVal = params.value;
    this.isSlideChecked = params.data?.checked;
  }

  btnAction(event: any, btnAction: string) {
    event.stopPropagation();
    this.params.action({ action: btnAction, params: this.params });
  }
  
  slideChanged(event: any, matSlideToggle: MatSlideToggle) {
    this.params.action({ type: 'switch', action: matSlideToggle, params: this.params });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }


}
