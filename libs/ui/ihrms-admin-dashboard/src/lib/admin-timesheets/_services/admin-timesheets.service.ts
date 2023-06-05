import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import {
  ControlBase,
  DatePickerControl,
  DropdownControl,
  TextAreaControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminTimesheetsService {

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

  // TODO: get from a remote source of controls metadata
  getTimesheetDynamicControls() {

    const controls: ControlBase<string>[] = [

      new DropdownControl({
        key: 'assignedToID',
        label: 'Assign To',
        validators: {
          required: true,
        },
        order: 1,
        options: []
      }),

      new TextBoxControl({
        key: 'projectName',
        label: 'Project',
        validators: {
          required: true,
        },
        order: 1,
        // options: [
        //   { key: 'Office Management', value: 'Office Management' },
        //   { key: 'Video Calling App', value: 'Video Calling App' },
        // ]
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
        order: 1,
      }),

      new DatePickerControl({
        key: 'assignedDate',
        label: 'Assigned Date',
        validators: {
          required: true,
        },
        order: 1,
      }),

      // new TextBoxControl({
      //   key: 'Remaining Hours',
      //   label: 'Remaining Hours',
      //   order: 1,
      // }),

      new DropdownControl({
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ]
      }),

      new TextBoxControl({
        key: 'hours',
        label: 'Hours',
        order: 1,
        type: 'number'
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

export const GQL_TIMESHEETS= gql`
  query result(
    $query: Pagination!
  ) {
    getTimesheets(
      query: $query
    ) {
      _id
      assignedDate
      assignedToID
      assignedTo {
        _id
        username
      }
      comments
      createdByID
      createdBy {
        _id
        username
      }
      department {
        name
      }
      endDate
      hours
      projectName
      startDate
      status
      audit {
        created_at
      }
    }
  }
`;

export const GQL_TIMESHEETS_CREATE = gql`
  mutation CreateTimesheet(
    $projectName: String!, 
    $assignedToID: ID!, 
    $createdByID: ID!, 
    $assignedDate: ISODate, 
    $startDate: ISODate, 
    $endDate: ISODate, 
    $hours: Int, 
    $status: Boolean, 
    $comments: String
  ) {
    createTimesheet(
      projectName: $projectName, 
      assignedToID: $assignedToID, 
      createdByID: $createdByID, 
      assignedDate: $assignedDate, 
      startDate: $startDate, 
      endDate: $endDate, 
      hours: $hours, 
      status: $status, 
      comments: $comments
    ) {
      _id
      assignedDate
      assignedTo {
        username
      }
      comments
      createdBy {
        username
      }
      department {
        name
      }
      endDate
      hours
      projectName
      startDate
      status
    }
  }
`;

export const GQL_TIMESHEETS_UPDATE = gql`
  mutation editTimesheet(
    $id: ID, 
    $projectName: String!, 
    $assignedToID: ID!, 
    $createdByID: ID!, 
    $assignedDate: ISODate, 
    $startDate: ISODate, 
    $endDate: ISODate, 
    $hours: Int, 
    $status: Boolean, 
    $comments: String
  ) {
    editTimesheet(
      _id: $id, 
      projectName: $projectName, 
      assignedToID: $assignedToID, 
      createdByID: $createdByID, 
      assignedDate: $assignedDate, 
      startDate: $startDate, 
      endDate: $endDate, 
      hours: $hours, 
      status: $status, 
      comments: $comments
    ) {
      _id
      assignedDate
      assignedTo {
        username
      }
      comments
      createdBy {
        username
      }
      department {
        name
      }
      endDate
      hours
      projectName
      startDate
      status
    }
  }
`;