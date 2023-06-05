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

@Injectable({
  providedIn: 'root'
})
export class EmpLeavesService {

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
  getRequestLeaveDynamicControls() {

    const controls: ControlBase<string>[] = [

      new DatePickerControl({
        key: 'startDate',
        label: 'Start Date',
        validators: {
          required: true,
          minDate: new Date(Date.now()),
        },
        order: 1,
        fxFlex: 48
      }),

      new DatePickerControl({
        key: 'endDate',
        label: 'End Date',
        validators: {
          required: true,
          minDate: new Date(Date.now()),
        },
        order: 1,
        fxFlex: 48
      }),

      new DropdownControl({
        key: 'leaveTypeID',
        label: 'Leave Types',
        validators: {
          required: true,
        },

        order: 1,
        fxFlex: 48,
        controlType: 'dropdown',
        options:[],
        
      }),

      new TextBoxControl({
        key: 'days',
        label: 'Days',
        order: 1,
        fxFlex: 48,
        type: 'number',
        validators: {
          required: true,
          min: 1
        },
      }),

      new DropdownControl({
        key: 'toManagerID',
        label: 'To',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        disabled: true,
        controlType: 'dropdown',
        options:[],
      }),

      new TextBoxControl({
        key: 'remainingDays',
        label: 'Remaining Leaves',
        disabled: true,
        order: 1,
        fxFlex: 48,
        
      }),

      new TextAreaControl({
        key: 'comments',
        label: 'Comments',
        order: 1,
        validators: {
          required: true,
        },
        fxFlex: 100
      })
    ];
    

    return of(controls.sort((a, b) => a.order - b.order));
  }

}
