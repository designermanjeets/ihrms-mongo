import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GQL_EMPLOYEE_TYPES, GQL_EMPLOYEE_TYPES_CREATE, GQL_EMPLOYEE_TYPES_UPDATE, OtherMastersService } from '../_services/other-masters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-employee-type',
  templateUrl: './employee-type.component.html',
  styleUrls: ['./employee-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTypeComponent implements OnInit, OnDestroy {

  formEmployeeType!: FormGroup;
  employeeTypeControls$!: Observable<ControlBase<any>[]>;
  formEmployeeTypeSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  employeeTypesData: any | undefined;
  employeeTypeBtnText = CONSTANTS.ADD;
  employeeTypesGridApi!: GridApi;
  employeeTypesGridColumnApi!: ColumnApi;
  employeeTypeRowCurrentSelected!: number;
  employeeTypeRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    public dialog: MatDialog,
    private _oms: OtherMastersService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.employeeTypeControls$ = this._adss.getEmployeeTypeControls();

    this.employeeTypesData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'name' },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
          { field: 'comments' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputEmployeeTypesActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.employeeTypeRowIndexOrID,
      },
      flex: 100
    };

    this.getEmployeeTypes();

  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getEmployeeTypes() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEE_TYPES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getEmployeeTypes))
      .subscribe(val => this.employeeTypeRowIndexOrID.next({ rowData: val, action: CONSTANTS.UPDATE}));
  }

  // Employee Type form
  employeeTypeFormSubmitEvent(event: any) {
    if(this.employeeTypeBtnText === CONSTANTS.EDIT) {
      const paylaod = { ...event, id: event._id }
      this.apollo.mutate({ mutation: GQL_EMPLOYEE_TYPES_UPDATE, variables: paylaod })
        .pipe(map((data: any) => data?.data?.editEmployeeType))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.employeeTypeRowIndexOrID.next({rowIndex: this.employeeTypeRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
          }
        });
    }
    if(this.employeeTypeBtnText === CONSTANTS.ADD) {
      delete event.id;
      this.apollo.mutate({ mutation: GQL_EMPLOYEE_TYPES_CREATE, variables: event })
        .pipe(map((data: any) => data?.data?.createEmployeeType))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Created Successfully!`, { } );
            this.employeeTypeRowIndexOrID.next({ data: val, action: CONSTANTS.ADD});
          }
        });
    }
    //
    this.employeeTypeBtnText = CONSTANTS.ADD;
    this.formEmployeeType.reset();
  }

  employeeTypeFormObjectEvent(form: FormGroup) {
    this.formEmployeeType = form;
  }

  onEmployeeTypeSaveEvent(event: any) {
    this.formEmployeeTypeSubmit$.next(true);
  }

  onEmployeeTypesGridReady(event: any) {
    this.employeeTypesGridApi = event.gridApi;
    this.employeeTypesGridColumnApi = event.gridColumnApi;
  }

  outputEmployeeTypesActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formEmployeeType.patchValue(fData);
      this.employeeTypeBtnText = CONSTANTS.EDIT;
      this.employeeTypeRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      const dialogRef = this._ihrmsadss.openAddEntityDialog(
        CONSTANTS.TITLES.EmployeeType,
        CONSTANTS.CANCEL,
        event?.params?.rowIndex,
        event?.params?.data,
        true,
        this._adss,
        this._ihrmsadss,
        this.employeeTypeRowIndexOrID,
        CONSTANTS.TITLES.EmployeeType,
        this.dialog,
        'getEmployeeTypeControls'
      );
    }
  }

}
