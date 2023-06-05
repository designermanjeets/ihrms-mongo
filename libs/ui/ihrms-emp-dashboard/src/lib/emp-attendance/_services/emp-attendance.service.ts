import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import * as moment from 'moment';
import { CONSTANTS } from '@ihrms/shared';
import { finalize, map } from 'rxjs/operators';
import { GQL_ATTENDANCE_CORRECTION_CREATE, IhrmsEmpDashboardService } from '../../_services/ihrms-emp-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class EmpAttendanceService {

  userManager: any;

  constructor(
    private _ihrmsempss: IhrmsEmpDashboardService,
    private toastrService: ToastrService,
  ) {

    this._ihrmsempss.getUserManager().subscribe(val => val && (this.userManager = [{ _id: val.reportingManager?._id, name: val.reportingManager?.username }]));
  }

  getGridsterOptions(cardSize: number, _this: any, gridType?: any) {
    return {
      fixedRowHeight: cardSize,
      gridType: gridType !== 'scroll'? GridType.Fit: GridType.VerticalFixed,
      compactType: CompactType.CompactUp,
      draggable: { enabled: false },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      useTransformPositioning: true,
      displayGrid: DisplayGrid.None,
      itemChangeCallback: (item: GridsterItem) => {
        // update DB with new size
      },
      itemResizeCallback: (item: GridsterItem) => {
        // update DB with new size
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => _this.gridResize.next(true), 500); // Sometimes Buggy
      }
    };
  }

  // TODO: get from a remote source of controls metadata
  getDynamicControls() {

    const controls: ControlBase<string>[] = [
      {
        key: '_id',
        label: '_id',
        order: 1,
        controlType: 'hidden'
      },
      {
        key: 'userId',
        label: 'userId',
        order: 1,
        controlType: 'hidden',
        value: JSON.parse(sessionStorage.getItem('auth-user') || '').userID
      },
      {
        key: 'date',
        label: 'Date',
        protected: true,
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'punchIn',
        label: 'Punch In',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'timepicker'
      },
      {
        key: 'punchOut',
        label: 'Punch Out',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'timepicker'
      },
      {
        key: 'toManagerID',
        label: 'Manager',
        validators: {
          required: true,
        },
        order: 1,
        disabled: true,
        controlType: 'dropdown'
      },
      {
        key: 'shiftName',
        label: 'Shift',
        protected: true,
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'totalHours',
        label: 'Production',
        disabled: true,
        order: 1,
        controlType: 'textbox'
      },
      {
        key: 'overtime',
        label: 'Overtime',
        order: 1,
        type: 'number',
        disabled: true,
        controlType: 'textbox'
      },
      {
        key: 'comments',
        label: 'Comment',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getAttendanceColDefs(outputActions: any, _this: any) {
    return [
      { field: '_id', headerName: 'Date', sort: 'desc', cellRenderer: (data: any) => data.value && this._ihrmsempss.getCurrentZoneTime(data.value) },
      { field: 'date', hide: true },
      { field: 'toManagerID', hide: true },
      { field: 'punchIn', headerName: 'PunchIn', cellRenderer: (node: any) => node.value && this._ihrmsempss.getLocalTimeZone(node.data.date, node.value) },
      { field: 'punchOut', headerName: 'PunchOut', cellRenderer: (node: any) => node.value && this._ihrmsempss.getLocalTimeZone(node.data.date, node.value) },
      { field: 'shiftName', headerName: 'Shift' },
      { field: 'totalHours', headerName: 'Production' },
      { field: 'overtime', headerName: 'Overtime' },
      { field: 'comments', headerName : 'Comments' },
      { field: 'Action', width: 300, filter: false, cellClass: "grid-cell-centered", cellRenderer: 'ReqCorrectionComponent',
        cellRendererParams: {
          action: outputActions.bind(_this)
        }
      },
    ]
  }

  getAttendanceRequestColDefs(outputActions: any, _this: any) {
    return [
      { field: 'audit.created_at', sort: 'desc', cellRenderer: (data: any) => data.value && this._ihrmsempss.getCurrentZoneTime(data.value) },
      { field: 'user.username', headerName : 'Employee' },
      { field: 'toManager.username', headerName : 'Manager' },
      { field: 'attendanceType' },
      { field: 'startDate', headerName : 'startDate' },
      { field: 'endDate', headerName : 'endDate', cellRenderer: (data: any) => data.value && this._ihrmsempss.getCurrentZoneTime(data.value) },
      { field: 'address', headerName : 'Address' },
      { field: 'comments', headerName : 'Comments' },
      { field: 'status' },
      { field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: outputActions.bind(_this),
          value: { actionBtn: [ 'cancel' ] },
          type: CONSTANTS.REQUEST_ATTENDANCE
        }
      },
    ]
  }

  getRowDataAndUpdateSubjectAllByUserID(rowDataObj: any, updateSubject: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._ihrmsempss.getEntityAllByUserID(CONSTANTS.TITLES.AttendanceRequest, +sessionStorage.getItem('auth-user'))
      .pipe(map((data: any) => data?.result))
      .subscribe(val => {
        if(val) {
          rowDataObj = val;
          updateSubject && updateSubject.next({ action: CONSTANTS.UPDATE, rowData: rowDataObj });
        }
      });
  }

  getRowDataAndUpdateSubjectAllWithParams(rowDataObj: any, action?: string | undefined, updateSubject?: any, params?: any) {
    this._ihrmsempss.getEntityAllWithParams(CONSTANTS.TITLES.Attendance, action, params)
      .pipe(map((data: any) => data?.result?.items || data?.result))
      .subscribe(val => {
        if(val) {
          rowDataObj = val;
          updateSubject && updateSubject.next({ action: CONSTANTS.UPDATE, rowData: rowDataObj });
          if(!val.length) {
            this.toastrService.error( '', `There's No Data for Selected Date Range!`, { } );
          }
        }
      });
  }

  getCylinderChartDataWithParams(entity: string, arrToOperate: any, action?: string | undefined, params?: any ) {
    return this._ihrmsempss.getEntityAllWithParams(entity, action, params)
      .pipe(
        map((data: any) => {
          const nSeriesData = [] as any; const nXAxisCategories = [] as any;
          if(data?.result?.items || data?.result) {

            const val = data?.result?.items || data?.result;

            val[0][arrToOperate].forEach((item:any) => {
              nSeriesData.push([item.totalWorkingHours]);
              nXAxisCategories.push(item.weekName);
            });

            if(!val[0][arrToOperate].length) {
              this.toastrService.error( '', `There's No Data`, { } );
            }
          }
          return [nSeriesData, nXAxisCategories];

        }),
        finalize(() => console.log('Finalize'))
      );
  }

  getPieChartDataWithParams(entity: string, arrToOperate: any, action?: string | undefined, params?: any ) {
    return this._ihrmsempss.getEntityAllWithParams(entity, action, params)
      .pipe(
        map((data: any) => {
          const nSeriesData = [] as any;
          if(data?.result?.items || data?.result) {

            const val = data?.result?.items || data?.result;

            val[0][arrToOperate].forEach((item:any) => {
              nSeriesData.push([item.attendanceType, item.totalRequest]);
            });

            if(!val[0][arrToOperate].length) {
              this.toastrService.error( '', `There's No Data`, { } );
            }
          }
          return [nSeriesData];

        }),
        finalize(() => console.log('Finalize'))
      );
  }

  outputActions(event: any, _eas: any, dialog: any, sub: any, rowIndexOrID: any) {
    const mutation = GQL_ATTENDANCE_CORRECTION_CREATE;
    const methodName = 'createAttendanceCorrection';
    const dialogRef = this._ihrmsempss.dynamicCompClickHandler(
      event,
      _eas,
      this._ihrmsempss,
      rowIndexOrID,
      CONSTANTS.TITLES.EditAttendance,
      '',
      dialog,
      mutation,
      methodName
    );
      
    sub = dialogRef?.componentInstance?.dialogEventEmitter.subscribe((result: any) => {
      if(result && dialogRef.componentInstance) {
        if(result.action === CONSTANTS.FORM_OBJECT_EVENT) {
          this._ihrmsempss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.userManager, 'toManagerID', '_id')
          dialogRef.componentInstance?.form.get('toManagerID').patchValue(this.userManager && this.userManager[0]?._id, { emitEvent: false });
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          if(result.value?.punchIn) {
            dialogRef.componentInstance?.form.get('punchOut').enable({ emitEvent: false });
            const control = dialogRef.componentInstance?.controlsObj.filter((c: any) => c.key === 'punchOut')[0];
            control && (control.validators.minTime = result.value.punchIn);
          }
          if(result.value?.punchOut) {
            const now  = moment(result.value.punchIn,"HH:mm:ss a");
            const then = moment(result.value.punchOut,"HH:mm:ss a");
            const diff = then.diff(now, 'hours', true);
            dialogRef.componentInstance?.form.get('totalHours').patchValue(`${diff.toFixed(2)}`, { emitEvent: false });
          }
        }
      }
    });
  }

}

export const GQL_GET_ATTENDANCE_BY_DATE_WISE = gql`
  query Query($query: Pagination!) {
    getAttendancesByDayWise(query: $query)
  }
`;

export const GQL_GET_ATTENDANCE_REQUEST_BY_DATE_WISE = gql`
  query Query($query: Pagination!) {
    getAttendanceRequestsByDayWise(query: $query)
  }
`;

export const GQL_TODAYS_ATTENDANCES_DAY_ALL_USERS_AVG = gql`
  query result(
    $query: Pagination!
  ) {
    getAttendancesByDayWiseAllUsersAvg(query: $query)
  }
`;

export const GQL_ATTENDANCES_REQUESTS = gql`
  query GetAttendanceRequests($query: Pagination!) {
    getAttendanceRequests(query: $query) {
      _id
      attendanceType
      comments
      days
      startDate
      endDate
      status
      toManager {
        username
      }
      user {
        username
      }
      audit {
        created_at
      }
    }
  }
`;