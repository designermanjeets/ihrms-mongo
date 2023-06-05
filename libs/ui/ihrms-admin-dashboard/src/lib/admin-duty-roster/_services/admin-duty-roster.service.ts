import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminDutyRosterService {

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
     {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden'
      },
      {
        key:"action",
        label:"action",
        order:1,
        validators: {
          required: true,
        },
        controlType:'dropdown',
        options:[
          { key:'swap',value:'Swap'},
          { key:'change',value:'Change' }
        ]
      },
      {
        key:"department",
        label:"Department",
        order:1,
        validators: {
          required: true,
        },
        controlType:'dropdown',
        options:[]
      },
      {
        key: 'date',
        label: 'Date',
        validators: {
          required: true,
          minDate: new Date(Date.now()),
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key:"fromUsereCode",
        label:"From User",
        order:1,
        validators: {
          required: true,
        },
        controlType:'dropdown',
        options:[]
      },
       {
        key:'toUserCode',
          label:"To User",
        order:1,
        validators: {
          required: true,
        },
        controlType:'dropdown',
        options:[]
      },
      {
        key: 'fromShift',
        label: 'fromShift',
        order: 1,
        validators: {
          required: true,
        },
        options: [],
        controlType:'dropdown',
      },
      {
        key: 'toShift',
        label: 'toShift',
        order: 1,
        validators: {
          required: true,
        },
        options: [],
        controlType:'dropdown',
      },
      {
        key: 'comments',
        label: 'Comments',
        order: 1,
        fxFlex: 100,
        validators: {
          required: true,
        },
        controlType: 'textarea'
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getStaticRosterData() {
    return {
      data: {
        createShiftRoster: {
          name: "JanShiftRoster",
          roster: [{
            user: [
              {
                eCode: "EMPRAJShiftCheck1",
                username: "NewRajShiftCheck1"
              }
            ],
            dateRange: [{
                date: "01/03/2022",
                shifts: [
                  {
                    _id: "6234ca2fa059cd502cb290f7",
                    name: "General"
                  },
                  {
                    _id: "6235a301262b9df660ec8770",
                    name: "Night"
                  }
                ]
              },
              {
                date: "02/03/2022",
                shifts: [
                  {
                    _id: "6235a301262b9df660ec8770",
                    name: "Night"
                  }
                ]
              },
              {
                date: "03/03/2022",
                shifts: [
                  {
                    _id: "6235a301262b9df660ec8770",
                    name: "Night"
                  },
                  {
                    _id: "6234ca2fa059cd502cb290f7",
                    name: "General"
                  }
                ]
              },
              {
                date: "04/03/2022",
                shifts: [
                  {
                    _id: "6234ca2fa059cd502cb290f7",
                    name: "General"
                  }
                ]
              }
            ]}
          ],
          status: true,
          comments: "By MJ"
        }
      }
    }
  }

}

export const GQL_ROSTER_UPLOAD = gql`
    mutation UploadMutation(
    $file: Upload!
  ) {
     uploadFileRoster(
     file: $file
    )
  }
`;

export const GQL_ROSTERS = gql`
  query Query($query: Pagination!) {
    getShiftRosters(query: $query) {
      _id
      month
      department
      name
      users
      status
      comments
    }
  }
`;


export const GQL_SWAP_SHIFT = gql`
  mutation ShiftSwapRequest(
    $action: String,
    $month: ISODate, 
    $date: ISODate, 
    $fromUsereCode: String, 
    $fromShift: String, 
    $toShift: String, 
    $toUserCode: String, 
    $department: String
  ) {
    shiftSwapRequest(
      action: $action
      month: $month, 
      date: $date, 
      fromUsereCode: $fromUsereCode, 
      fromShift: $fromShift, 
      toShift: $toShift, 
      toUserCode: $toUserCode, 
      department: $department
    ) 
  }
`;