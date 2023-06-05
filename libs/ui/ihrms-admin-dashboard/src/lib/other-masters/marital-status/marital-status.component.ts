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
  selector: 'ihrms-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaritalStatusComponent implements OnInit {

  formMaritalStatus!: FormGroup;
  maritalStatusControls$!: Observable<ControlBase<any>[]>;
  formMaritalStatusSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  maritalStatussData: any | undefined;
  maritalStatusBtnText = CONSTANTS.ADD;
  maritalStatussGridApi!: GridApi;
  maritalStatussGridColumnApi!: ColumnApi;
  maritalStatusRowCurrentSelected!: number;
  maritalStatusRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) { }

  ngOnInit(): void {

    this.maritalStatusControls$ = this._adss.getMaritalStatusControls();

    this.maritalStatussData = {
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
              action: this.outputMaritalStatussActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.maritalStatusRowIndexOrID,
      },
      flex: 100
    };

    this.getMaritalStatuss();

  }

  getMaritalStatuss() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.MaritalStatus)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.maritalStatussData.gridData.rowData = val);
  }

  // Employee Type form
  maritalStatusFormSubmitEvent(event: any) {
    if(this.maritalStatusBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.MaritalStatus, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.maritalStatusRowIndexOrID.next({rowIndex: this.maritalStatusRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.maritalStatusBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.MaritalStatus ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.maritalStatusRowIndexOrID.next({rowIndex: this.maritalStatusRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.maritalStatusBtnText = CONSTANTS.ADD;
    this.formMaritalStatus.reset();
  }

  maritalStatusFormObjectEvent(form: FormGroup) {
    this.formMaritalStatus = form;
  }

  onMaritalStatusSaveEvent(event: any) {
    this.formMaritalStatusSubmit$.next(true);
  }

  onMaritalStatussGridReady(event: any) {
    this.maritalStatussGridApi = event.gridApi;
    this.maritalStatussGridColumnApi = event.gridColumnApi;
  }

  outputMaritalStatussActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formMaritalStatus.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.maritalStatusBtnText = CONSTANTS.EDIT;
      this.maritalStatusRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.MaritalStatus, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.maritalStatusRowIndexOrID.next({rowIndex: this.maritalStatusRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.maritalStatussGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}
