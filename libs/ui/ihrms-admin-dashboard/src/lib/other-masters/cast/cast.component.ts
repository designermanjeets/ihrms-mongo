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
  selector: 'ihrms-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CastComponent implements OnInit {

  formCast!: FormGroup;
  castControls$!: Observable<ControlBase<any>[]>;
  formCastSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  castsData: any | undefined;
  castBtnText = CONSTANTS.ADD;
  castsGridApi!: GridApi;
  castsGridColumnApi!: ColumnApi;
  castRowCurrentSelected!: number;
  castRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) { }

  ngOnInit(): void {

    this.castControls$ = this._adss.getCastControls();

    this.castsData = {
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
              action: this.outputCastsActions.bind(this),
              value: { actionBtn: ['edit', 'cancel'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.castRowIndexOrID,
      },
      flex: 100
    };

    this.getCasts();

  }

  getCasts() {
    this._ihrmsadss.getEntityAll(CONSTANTS.TITLES.Cast)
      .pipe(map((data: any) => data?.result?.items))
      .subscribe(val => this.castsData.gridData.rowData = val);
  }

  // Employee Type form
  castFormSubmitEvent(event: any) {
    if(this.castBtnText === CONSTANTS.EDIT) {
      this._ihrmsadss.updateEntity(CONSTANTS.TITLES.Cast, event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.castRowIndexOrID.next({rowIndex: this.castRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.castBtnText === CONSTANTS.ADD) {
      delete event.id;
      this._ihrmsadss.createEntity(CONSTANTS.TITLES.Cast ,event)
        .pipe(map((data: any) => data?.result))
        .subscribe(val => {
          if(val) {
            this.castRowIndexOrID.next({rowIndex: this.castRowCurrentSelected, data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.castBtnText = CONSTANTS.ADD;
    this.formCast.reset();
  }

  castFormObjectEvent(form: FormGroup) {
    this.formCast = form;
  }

  onCastSaveEvent(event: any) {
    this.formCastSubmit$.next(true);
  }

  onCastsGridReady(event: any) {
    this.castsGridApi = event.gridApi;
    this.castsGridColumnApi = event.gridColumnApi;
  }

  outputCastsActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formCast.patchValue({
        id: fData.id,
        name: fData.name || '',
        comments: fData.comments || '',
        CustomPolicy: null,
      });
      this.castBtnText = CONSTANTS.EDIT;
      this.castRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.Cast, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.castRowIndexOrID.next({rowIndex: this.castRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.castsGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

}
