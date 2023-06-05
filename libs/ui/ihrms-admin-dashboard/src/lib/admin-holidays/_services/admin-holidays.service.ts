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
export class AdminHolidaysService {

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
  getDynamicControls() {

    const controls: ControlBase<string>[] = [

      new TextBoxControl({
        key: 'name',
        label: 'Holiday',
        validators: {
          required: true,
          
        },
        protected:true,
        order: 1,
      }),

      new DatePickerControl({
        key: 'date',
        label: 'Date',
        validators: {
          required: true,
        },
        
        order: 1,
      }),

      new DropdownControl({
        key: 'status',
        label: 'Status',
        validators:{   
          required:true,       
        } ,
          
        
        order: 1,
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ]
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

export const GQL_HOLIDAYS = gql`
  query result(
    $query: Pagination!
  ) {
    getHolidays(
      query: $query
    ) {
      name
      date
      status
      comments
    }
  }
`;

export const GQL_CREATE_HOLIDAY = gql`
  mutation holidayMutation(
    $name: String!
    $date: ISODate!
    $status: Boolean
    $comments: String
  ) {
    createHolidays(
      name: $name
      date: $date
      status: $status
      comments: $comments
    ) {
      _id
      name
      date
      status
      comments
      audit {
        modified_at
      }       
    }
  }
`;

export const GQL_UPDATE_HOLIDAY = gql`
  mutation holidayMutation(
    $name: String!
    $date: ISODate!
    $status:Boolean
    $comments: String
  ) {
    editHolidays(
      name: $name
      date: $date
      status: $status
      comments: $comments
    ) {
      _id
      name
      date
      status
      comments
      audit {
        modified_at
      }       
    }
  }
`;
