import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { finalize, map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { gql } from 'apollo-angular';
import { CONSTANTS } from '@ihrms/shared';
import { ControlBase, DatePickerControl, DropdownControl, HeadingControl, HiddenControl, TextAreaControl, TextBoxControl } from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminAttendanceService {
  userManager: any;
  constructor(
    private _ihrmsempss: IhrmsAdminDashboardService,
    private toastrService: ToastrService,
  ) {
    this._ihrmsempss.getUserManager().subscribe(val => val && (this.userManager = [{ _id: val.reportingManager?._id, name: val.reportingManager?.username }]));
  }

  getGridsterOptions(cardSize: number, _this: any) {
    return {
      fixedRowHeight: cardSize,
      gridType: GridType.Fit,
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

  getDynamicControls() {

    const controls: ControlBase<string>[] = [

      new HiddenControl({
        key: '_id',
        label: '_id',
        order: 1,
      }),

      new TextBoxControl({
        key: 'status',
        label: 'Status',
        order: 1,
        disabled: true,
      }),

      new TextBoxControl({
        key: 'userfield',
        label: 'User',
        order: 1,
        disabled: true,
      }),

      new HiddenControl({
        key: 'attendanceType',
        label: 'Attendance Type',
        order: 1,
        disabled: true,
      }),

      new DatePickerControl({
        key: 'startDate',
        label: 'Start Date',
        validators: {
          required: true,
        },
        order: 1,
      }),

      new DatePickerControl({
        key: 'endDate',
        label: 'End Date',
        validators: {
          required: true,
        },
        order: 1
      }),

      new TextBoxControl({
        key: 'days',
        label: 'Days',
        order: 1,
        validators: {
          required: true,
        },
      }),

      new TextBoxControl({
        key: 'toManagerIDField',
        label: 'Manager',
        validators: {
          required: true,
        },
        order: 1,
        disabled: true,
      }),

      new HiddenControl({
        key: 'latitude',
        label: 'Latitude',
        order: 1,
        disabled: true,
      }),

      new HiddenControl({
        key: 'longitude',
        label: 'Longitude',
        order: 1,
        disabled: true,
      }),

      new TextBoxControl({
        key: 'location',
        label: 'Location',
        order: 1,
        disabled: true,
        placeholder: 'Address'
      }),

      new TextBoxControl({
        key: 'manualLocation',
        label: 'Manual Location',
        order: 1,
      }),

      new HeadingControl({
        key: '',
        order: 1,
      }),

      new TextAreaControl({
        key: 'comments',
        label: 'Comments',
        order: 1,
        fxFlex: 100
      })
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  
  getAttendanceTimeCorrectionsControls() {
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
        key: 'inTime',
        label: 'Punch In',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'timepicker'
      },
      {
        key: 'outTime',
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
        controlType: 'textbox'
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
      // {
      //   key: 'overtime',
      //   label: 'Overtime',
      //   order: 1,
      //   type: 'number',
      //   disabled: true,
      //   controlType: 'textbox'
      // },
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

  getAttendanceRequestColDefs(outputActions: any, _this: any) {
    return [
      { field: 'Action', cellRenderer: 'GridActionComponent',
        cellRendererParams: {
          action: outputActions.bind(_this),
          value: { actionBtn: [ 'check_circle', 'cancel' ] },
          type: CONSTANTS.REQUEST_ATTENDANCE
        }
      },
      { field: 'status' },
      { field: 'attendanceType' },
      { field: 'user.username', headerName : 'Employee' },
      { field: 'toManager.username', headerName : 'Manager' },
      { field: 'startDate', headerName : 'startDate', cellRenderer: (data: any) => data.value && this.getCurrentZoneTime(data.value) },
      { field: 'endDate', headerName : 'endDate', cellRenderer: (data: any) => data.value && this.getCurrentZoneTime(data.value) },
      { field: 'address', headerName : 'Address' },
      { field: 'comments', headerName : 'Comments' },
      { field: 'audit.created_at', sort: 'desc', cellRenderer: (data: any) => data.value && this.getCurrentZoneTime(data.value) },
  ]
  }
  

  getCurrentZoneTime(d: any) {
    return moment(d).format('MM/DD/YYYY');
  }

  getPieChartDataWithParams(entity: string, arrToOperate: any, action?: string | undefined, params?: any ) {
    return this._ihrmsempss.getEntityAllWithParams(entity, action, params)
      .pipe(
        map((data: any) => {
          const nSeriesData = [] as any;
          if(data?.result?.items || data?.result) {

            const val = [
              {
                firstName: "First Employee",
                lastName: "Singh",
                userId: 5,
                workingHours: [40]
              },
              {
                firstName: "Test Manager",
                lastName: "Singh",
                userId: 4,
                workingHours: [45]
              },
              {
                firstName: "admin",
                lastName: "admin",
                userId: 1,
                workingHours: [42]
              }
            ];

            val.forEach((item:any) => {
              nSeriesData.push([item.firstName, ...item.workingHours]);
            });

            if(!val[0].workingHours.length) {
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
          dialogRef.componentInstance?.form.get('toManagerID')?.patchValue(this.userManager && this.userManager[0]?._id, { emitEvent: false });
        }
        if(result.action === CONSTANTS.FORM_VALUE_CHANGE) {
          if(result.value?.punchIn) {
            dialogRef.componentInstance?.form.get('punchOut')?.enable({ emitEvent: false });
            const control = dialogRef.componentInstance?.controlsObj.filter((c: any) => c.key === 'punchOut')[0];
            control && (control.validators.minTime = result.value.punchIn);
          }
          if(result.value?.punchOut) {
            const now  = moment(result.value.punchIn,"HH:mm:ss a");
            const then = moment(result.value.punchOut,"HH:mm:ss a");
            const diff = then.diff(now, 'hours', true);
            dialogRef.componentInstance?.form.get('totalHours')?.patchValue(`${diff.toFixed(2)}`, { emitEvent: false });
          }
          console.log(result.value);
        }
      }
    });
  }

}

export const GQL_TODAYS_ATTENDANCES = gql`
  query result(
    $query: Pagination!
  ) {
    getAttendances(query: $query) {
      _id
      comments
      date
      inTime
      outTime
      overTime
      shift {
        name
      }
      totalDayWorkingHours
      user {
        username
      }
    }
  }
`;

export const GQL_ATTENDANCE_UPLOAD = gql`
  mutation UploadMutation(
    $file: Upload!
  ) {
    uploadFileAttendance(
      file: $file
    )
  }
`;

export const GQL_UPLOAD_ATTENDANCE_DETAILS = gql`
  mutation InsertManyMutation(
    $input: Void!
  ) {
    insertManyAttendances(input: $input)
  }
`;

export const GQL_DAYS_WISE_ATTENDANCES = gql`
  query result(
    $query: AttendanceSheetInput!
  ) {
    getDayWiseAttendances(query: $query)
  }
`;

export const GQL_TODAYS_ATTENDANCES_DAY_ALL_USERS = gql`
  query result(
    $query: Pagination!
  ) {
    getAttendancesByDayWiseAllUsers(query: $query)
  }
`;

export const GQL_TODAYS_ATTENDANCES_OVERVIEW = gql`
  query result(
    $query: Pagination!
  ) {
    getAttendanceRequestsByDayWiseOverview(query: $query)
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
        _id
      }
      user {
        username
        _id
      }
      audit {
        created_at
      }
    }
  }
`;

export const GQL_ATTENDANCE_TIME_CORRECTIONS= gql`
  query GetAttendanceCorrections($query: Pagination!) {
    getAttendanceCorrections(query: $query) {
      _id
      comments
      date
      eCode
      inTime
      outTime
      overTime
      shiftName
      status
      toManager {
        username
      }
      toManagerID
      totalDayWorkingHours
      user {
        username
        reportingManager {
          username
          _id
        }
      }
      userId
    }
  }
`;

export const GQL_ATTENDANCE_CORRECTION_APPROVE_REJECT = gql`
  mutation ApproveRejectTimeCorrection(
    $userId: ID!,
    $_id: ID, 
    $toManagerID: ID, 
    $eCode: String, 
    $date: ISODate, 
    $inTime: ISODate, 
    $outTime: ISODate,
    $shiftName: String
    $overTime: Int,
    $totalDayWorkingHours: String,
    $status: String,
    $comments: String,
    $created_by: String
  ) {
    approveRejectTimeCorrection(
      userId: $userId,
      _id: $_id,
      toManagerID: $toManagerID, 
      eCode: $eCode, 
      date: $date, 
      inTime: $inTime, 
      outTime: $outTime, 
      shiftName: $shiftName, 
      overTime: $overTime, 
      totalDayWorkingHours: $totalDayWorkingHours, 
      status: $status,
      comments: $comments,
      created_by: $created_by,
    ) {
      _id
      inTime
      outTime
      eCode
      date
      overTime
      shiftName
      toManager {
        username
        _id
      }
      toManagerID
      totalDayWorkingHours
      user {
        username
        _id
      }
      userId
      comments
    }
  }
`;

export const GQL_ATTENDANCE_TYPE_APPROVE_REJECT = gql`
  mutation ApproveRejectAttendanceRequest(
    $id: ID
    $userId: ID!, 
    $startDate: ISODate!, 
    $endDate: ISODate!,
    $status: String ,
    $days: Int!, 
    $attendanceType: String!
  ) {
    approveRejectAttendanceRequest(
      _id: $id
      userId: $userId,
      status: $status,
      startDate: $startDate, 
      endDate: $endDate, 
      days: $days, 
      attendanceType: $attendanceType
    ) {
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
        _id
      }
      audit {
        created_at
      }
    }
  }
`;

export const GQL_UPLOAD_ATTENDANCE_SQL = gql`
  mutation insertManyAttendanceSQL(
    $input: Void!
  ) {
    insertManyAttendanceSQL(input: $input)
  }
`;

export const GQL_ATTENDANCE_CORRECTION_CREATE = gql`
  mutation CreateAttendanceCorrection(
    $userId: ID!, 
    $toManagerID: ID, 
    $eCode: String, 
    $date: ISODate, 
    $inTime: ISODate, 
    $outTime: ISODate,
    $shiftName: String
    $overTime: Int,
    $totalDayWorkingHours: String,
    $status: String,
    $comments: String
  ) {
    createAttendanceCorrection(
      userId: $userId, 
      toManagerID: $toManagerID, 
      eCode: $eCode, 
      date: $date, 
      inTime: $inTime, 
      outTime: $outTime, 
      shiftName: $shiftName, 
      overTime: $overTime, 
      totalDayWorkingHours: $totalDayWorkingHours, 
      status: $status,
      comments: $comments
    ) {
      _id
      inTime
      outTime
      eCode
      date
      overTime
      shiftName
      toManager {
        username
        _id
      }
      toManagerID
      totalDayWorkingHours
      user {
        username
        _id
      }
      userId
      comments
    }
  }
`;