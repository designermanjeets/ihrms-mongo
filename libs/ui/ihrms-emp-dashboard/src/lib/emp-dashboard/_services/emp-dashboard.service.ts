import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import {
  ControlBase,
  DatePickerControl, DropdownControl, HeadingControl,
  HiddenControl,
  TextAreaControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SharedService } from '@ihrms/shared';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})

export class EmpDashboardService {

  environment: any;

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) {
  }

  getAllUsers() {

    return this.http.get<any>(`${this.sharedService.environment.apiURL}/services/app/User/GetAll`)
      .pipe(map(data => {
        return data;
      }));

  }

  getGridsterOptions(cardSize: number, _this: any) {
    return {
      fixedRowHeight: cardSize,
      gridType: GridType.Fit,
      compactType: CompactType.CompactUp,
      draggable: { enabled: false },
      resizable: {
        enabled: false
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
      itemResizeCallback: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
        // update DB with new size
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => _this.gridResize.next(true), 500); // Sometimes Buggy
      }
    };
  }

  // TODO: get from a remote source of controls metadata
  getOnDutyDynamicControls() {

    const controls: ControlBase<string>[] = [

      new TextBoxControl({
        key: 'userId',
        label: 'User ID',
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

      new DropdownControl({
        key: 'toManagerID',
        label: 'Manager',
        validators: {
          required: true,
        },
        order: 1,
        disabled: true,
        options:[],
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
        validators: {
          required: true,
        },
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

}

export const GQL_GET_CLOCK_DATA = gql`
  query GetAttendances($query: Pagination!) {
    getAttendances(query: $query) {
      date
      inTime
      outTime
      userId
      user {
        username
      }
    }
  }
`;

export const GQL_LEAVES_DATA = gql`
  query getLeaveRequests($query: Pagination!) {
    getLeaveRequests(query: $query) {
      _id
      days
      leaveType {
        name
      }
    }
  }
`;

export const GQL_ATTENDANCE_REQUEST_CREATE = gql`
  mutation createAttendanceRequest(
    $userId: ID!, 
    $startDate: ISODate!, 
    $endDate: ISODate!, 
    $days: Int!, 
    $attendanceType: String!, 
    $toManagerID: ID
  ) {
    createAttendanceRequest(
      userId: $userId, 
      startDate: $startDate, 
      endDate: $endDate, 
      days: $days, 
      attendanceType: $attendanceType, 
      toManagerID: $toManagerID
    ) {
      startDate
      endDate
      days
      attendanceType
      userId
      toManagerID
    }
  }
`;

export const GQL_TASKS_DATA = gql`
  query GetTasks($query: Pagination!) {
    getTasks(query: $query) {
      createdBy {
        username
      }
      days
      startDate
      endDate
      status
      timeTaken
      timeAssigned
      comments
    }
  }
`;