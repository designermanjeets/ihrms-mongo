import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { AdminSettingsService } from '../../admin-settings/_services/admin-settings.service';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GQL_SHIFTS, GQL_SHIFT_CREATE, GQL_SHIFT_EDIT } from '../_services/other-masters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ihrms-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftTypeComponent implements OnInit, OnDestroy {

  formShiftType!: FormGroup;
  shiftTypeControls$!: Observable<ControlBase<any>[]>;
  shiftTypeControlsObj!: ControlBase<any>[];
  formShiftTypeSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  shiftTypesData: any | undefined;
  shiftTypeBtnText = CONSTANTS.ADD;
  shiftTypesGridApi!: GridApi;
  shiftTypesGridColumnApi!: ColumnApi;
  shiftTypeRowCurrentSelected!: number;
  shiftTypeRowIndexOrID: Subject<any> = new Subject();

  sub!: Subscription;

  constructor(
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private cdRef: ChangeDetectorRef,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.shiftTypeControls$ = this._adss.getShiftTypeControls();
    this.sub = this.shiftTypeControls$.subscribe((cntrls: ControlBase<any>[]) => this.shiftTypeControlsObj = cntrls);

    this.shiftTypesData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'name' },
          { field: 'code' },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
          { field: 'comments' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputShiftTypesActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.shiftTypeRowIndexOrID,
      },
      flex: 100
    };

    this.getShiftTypes();

  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getShiftTypes() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SHIFTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getShifts))
      .subscribe(val => this.shiftTypesData.gridData.rowData = val);
  }

  // Employee Type form
  shiftTypeFormSubmitEvent(event: any) {
    if(this.shiftTypeBtnText === CONSTANTS.EDIT) {
      !event.id && (event.id = event._id); // Mongo has _id
      this.apollo.mutate({ mutation: GQL_SHIFT_EDIT, variables: event, })
        .pipe(map((data: any) => data?.data.editShift))
        .subscribe(val => {
          if(val) {
            this.shiftTypeRowIndexOrID.next({rowIndex: this.shiftTypeRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.shiftTypeBtnText = CONSTANTS.ADD;
            this.formShiftType.reset();
          }
        });
    }
    if(this.shiftTypeBtnText === CONSTANTS.ADD) {
      delete event.id;
      this.apollo.mutate({ mutation: GQL_SHIFT_CREATE, variables: event, })
        .pipe(map((data: any) => data?.data.createShift))
        .subscribe(val => {
          this.shiftTypeRowIndexOrID.next({rowIndex: this.shiftTypeRowCurrentSelected, data: val, action: CONSTANTS.ADD})
          this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
          this.shiftTypeBtnText = CONSTANTS.ADD;
          this.formShiftType.reset();
        })
    }
  }

  shiftTypeFormObjectEvent(form: FormGroup) {
    this.formShiftType = form;
  }

  onShiftTypeSaveEvent(event: any) {
    this.formShiftTypeSubmit$.next(true);
  }

  onShiftTypesGridReady(event: any) {
    this.shiftTypesGridApi = event.gridApi;
    this.shiftTypesGridColumnApi = event.gridColumnApi;
  }

  outputShiftTypesActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formShiftType.patchValue(fData);
      this.shiftTypeBtnText = CONSTANTS.EDIT;
      this.shiftTypeRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.ShiftType, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            // this.shiftTypeRowIndexOrID.next({rowIndex: this.shiftTypeRowCurrentSelected, data: val, action: CONSTANTS.CANCEL});
            this.shiftTypesGridApi.applyTransaction({ remove: [event.params.data] });
            this._ihrmsadss.updateGridData(this.shiftTypesGridApi, this.shiftTypesData, this.cdRef);
          }
        });
    }
  }

}
