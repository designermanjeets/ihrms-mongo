import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ihrms-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusComponent implements OnInit {

  formStatus!: FormGroup;
  statusControls$!: Observable<ControlBase<any>[]>;
  formStatusSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  statussData: any | undefined;
  statusBtnText = CONSTANTS.ADD;
  statussGridApi!: GridApi;
  statussGridColumnApi!: ColumnApi;
  statusRowCurrentSelected!: number;
  statusRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) { }

  ngOnInit(): void {

    this.statusControls$ = this._adss.getStatusControls();

    this.statussData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'id' },
          { field: 'name' },
          { field: 'comments' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputStatussActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.statusRowIndexOrID,
      },
      flex: 100
    };

    this.getStatuss();

  }

  getStatuss() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.Status)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.statussData.gridData.rowData = val);
  }

  // Employee Type form
  statusFormSubmitEvent(event: any) {
    if(this.statusBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.Status, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.statusRowIndexOrID.next({rowIndex: this.statusRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.statusBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.Status ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.statusRowIndexOrID.next({rowIndex: this.statusRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.statusBtnText = CONSTANTS.ADD;
    this.formStatus.reset();
  }

  statusFormObjectEvent(form: FormGroup) {
    this.formStatus = form;
  }

  onStatusSaveEvent(event: any) {
    this.formStatusSubmit$.next(true);
  }

  onStatussGridReady(event: any) {
    this.statussGridApi = event.gridApi;
    this.statussGridColumnApi = event.gridColumnApi;
  }

  outputStatussActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formStatus.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.statusBtnText = CONSTANTS.EDIT;
      this.statusRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.Status, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.statusRowIndexOrID.next({rowIndex: this.statusRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.statussGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}
