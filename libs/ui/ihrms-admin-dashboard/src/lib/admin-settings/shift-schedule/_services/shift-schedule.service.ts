import { Injectable } from '@angular/core';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftScheduleService {

  getShiftScheduleControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'General',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Shift Name',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'code',
        label: 'Shift Code',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'shiftId',
        label: 'Shift',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'effectiveFrom',
        label: 'Effective From',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'datepicker'
      },
      {
        key: 'defaultTimeFrom',
        label: 'Default Shift Time- From',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'timepicker',
        placeholder: 'From'
      },
      {
        key: 'defaultTimeTo',
        label: 'Default Shift Time- To',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'timepicker',
        placeholder: 'To'
      },
      {
        label: 'Working Hours',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'minimumHoursRequired',
        label: 'Minimum hours required for day',
        order: 1,
        controlType: 'textbox',
        type: 'number',
        placeholder: 'Hours'
      },
      {
        key: 'minimumHoursRequiredHalfDay',
        label: 'Minimum hours required for Half day',
        order: 1,
        controlType: 'textbox',
        type: 'number',
        placeholder: 'Hours'
      },
      // {
      //   key: 'totalHoursCalculations',
      //   label: 'Total Hours Calculation',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: 'First Check-in & Last Check-out', value: 'First Check-in & Last Check-out' },
      //     { key: 'Every Valid Check-in & Check-out', value: 'Every Valid Check-in & Check-out' },
      //   ],
      //   fxFlex: 60,
      //   marginTop: 8
      // },
      {
        key: 'graceTimeRequired',
        label: 'Grace Time (in Mintues)',
        order: 1,
        controlType: 'textbox',
        type: 'number',
        placeholder: 'Grace Time'
      },
      {
        key: 'graceNumberTimeRequired',
        label: 'Grace Allowed Number Of Time',
        order: 1,
        controlType: 'textbox',
        type: 'number',
        placeholder: 'Grace Allowed Number Of Time'
      },
      // {
      //   label: 'Shift Rotation',
      //   order: 1,
      //   controlType: 'controlHeading',
      //   fxFlex: 100,
      //   class: ['light-blue-head ml-m-10 mr-m-10']
      // },
      // {
      //   key: 'ScheduleName',
      //   label: 'Schedule Name',
      //   validators: {
      //     required: true,
      //   },
      //   order: 1,
      //   controlType: 'textbox',
      // },
      // {
      //   key: 'scheduleFrequency',
      //   label: 'Rotation Frequency',
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [
      //     { key: 'Daily', value: 'Daily' },
      //     { key: 'Weekly', value: 'Weekly' },
      //     { key: 'Monthly', value: 'Monthly' },
      //   ]
      // },
      // {
      //   key: 'frequencyStartsOn',
      //   label: 'Frequency Start On',
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [ ]
      // },
      // {
      //   key: 'frequencyDays',
      //   label: 'Frequency In Days',
      //   order: 1,
      //   controlType: 'textbox',
      //   type: 'number',
      //   disabled: true,
      // },
      // {
      //   key: 'TimeofSchedule',
      //   label: 'Time of Schedule',
      //   validators: {
      //     required: true,
      //   },
      //   order: 1,
      //   controlType: 'timepicker',
      // },
      // {
      //   key: 'ApplicablePeriod',
      //   label: 'Applicable Period (From)',
      //   validators: {
      //     required: true,
      //   },
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [
      //     { key: 'Sunday', value: 'Sunday' },
      //     { key: 'Monday', value: 'Monday' },
      //     { key: '1', value: '1' },
      //     { key: '2', value: '2' },
      //   ]
      // },
      // {
      //   key: 'ApplicableFor',
      //   label: 'Applicable For',
      //   validators: {
      //     required: true,
      //   },
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [
      //     { key: 'Department', value: 'Department' },
      //     { key: 'Employee', value: 'Employee' },
      //     { key: 'Role', value: 'Role' },
      //   ]
      // },
      // {
      //   key: 'SelectApplicableFor',
      //   label: 'Select Applicable For',
      //   validators: {
      //     required: false,
      //   },
      //   order: 1,
      //   controlType: 'hidden',
      //   options: []
      // },
      // {
      //   key: 'ShiftRotationFrom',
      //   label: 'Shift Rotate From',
      //   validators: {
      //     required: true,
      //   },
      //   order: 1,
      //   controlType: 'dropdown',
      //   options: [
      //     { key: 'General', value: 'General' },
      //   ]
      // },
      // {
      //   key: 'shiftRotateTo',
      //   label: 'Shift Rotate To',
      //   order: 1,
      //   controlType: 'dropdown',
      //   disabled: true,
      //   options: [
      //     { key: 'Night', value: 'Night' },
      //   ]
      // },
      {
        label: 'Pay Days/Hours Calculation',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      // {
      //   key: 'includeWeekend',
      //   label: 'Include Weekend(s)',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'includeHolidays',
      //   label: 'Include Holidays',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'includeLeave',
      //   label: 'Include Leave',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      {
        key: 'carryOverBalanceHoursInOvertimeReport',
        label: 'Carry over balance as Overtime',
        order: 1,
        controlType: 'radioGroup',
        options: [
          { key: true, value: 'Enable' },
          { key: false, value: 'Disable' },
        ],
        marginTop: 8
      },
      {
        key: 'overtimeReportCalculationBy',
        label: 'Calculate Overtime By',
        order: 1,
        controlType: 'radioGroup',
        options: [
          { key: 'hour', value: 'Hours' },
          { key: 'day', value: 'Day' },
        ],
        marginTop: 8
      },
      // {
      //   label: 'Permissions',
      //   order: 1,
      //   controlType: 'controlHeading',
      //   fxFlex: 100,
      //   class: ['light-blue-head ml-m-10 mr-m-10']
      // },
      // {
      //   key: 'webCheckInCheckout',
      //   label: 'Web Check-in / Check-out',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'mobileCheckInCheckout',
      //   label: 'Mobile Check-in / Check-out',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'managerCanEdit',
      //   label: 'Manager Can Edit Entries',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'editTheirOwnEntries',
      //   label: 'Edit their own entries',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'notifyAdminOnEdit',
      //   label: 'Notify Admin on Edit',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   label: 'Shift Settings',
      //   order: 1,
      //   controlType: 'controlHeading',
      //   fxFlex: 100,
      //   class: ['light-blue-head ml-m-10 mr-m-10']
      // },
      // {
      //   key: 'EditEmployeeShiftMapping',
      //   label: 'View employee shift mapping',
      //   order: 1,
      //   controlType: 'dropdown',
      //   type: 'multiple',
      //   options: [
      //     { key: 'Administrator', value: 'Administrator' },
      //     { key: 'Reporting Manager', value: 'Reporting Manager' },
      //     { key: 'Employee', value: 'Employee' },
      //   ],
      // },
      // {
      //   key: 'EmailNotificationForShiftModification',
      //   label: 'Email notification for shift modification',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   marginTop: 8
      // },
      // {
      //   label: 'Regularization Settings',
      //   order: 1,
      //   controlType: 'controlHeading',
      //   fxFlex: 100,
      //   class: ['light-blue-head ml-m-10 mr-m-10']
      // },
      // {
      //   key: 'RegularizationForFutureDates',
      //   label: 'Regularization for future dates',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: true, value: 'Enable' },
      //     { key: false, value: 'Disable' },
      //   ],
      //   fxFlex: 18,
      //   marginTop: 8
      // },
      // {
      //   key: 'RegularizationRequestCanBeRaised',
      //   label: 'Regularization request can be raised',
      //   order: 1,
      //   type: 'number',
      //   controlType: 'textbox',
      //   hint: 'Day(s) from the date to be regularized',
      //   placeholder: '0 days'
      // },
      // {
      //   key: 'RegularizationEntriesWill',
      //   label: 'Regularization entries will',
      //   order: 1,
      //   controlType: 'radioGroup',
      //   options: [
      //     { key: 'Create a new check-in/check-out entry', value: 'Create a new check-in/check-out entry' },
      //     { key: 'Replace existing first check-in/ last check-out entry', value: 'Replace existing first check-in/ last check-out entry' },
      //   ],
      //   fxFlex: 'auto',
      //   marginTop: 8
      // },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}

export const GQL_SHIFTS_BY_ID = gql`
  query result(
    $query: Pagination!
  ) {
    getShifts(
      query: $query
    ) {
      _id
      name
      code
      status
      comments
      general {
        effectiveFrom
        defaultTimeFrom
        defaultTimeTo
        break
        overTimeApplicable
      }
      workingHours {
        minimumHoursRequired
        minimumHoursRequiredHalfDay
        totalHoursCalculations
        graceTimeRequired
        graceNumberTimeRequired
      }
      shiftRotation {
        scheduleName
        scheduleFrequency
        frequencyStartsOn
        timeOfSchedule
        frequencyDays
        applicableFor
        selectApplicableFor
        shiftRotateFrom
        shiftRotateTo
      }
      payDays {
        includeWeekend
        includeHolidays
        includeLeave
        carryOverBalanceHoursInOvertimeReport
        overtimeReportCalculationBy
      }
      permissions {
        webCheckInCheckout
        mobileCheckInCheckout
        managerCanEdit
        notifyAdminOnEdit
      }
      regularization {
        regularForFutureEnable
        requestCanBeRaisedForChangeDays
      }
      audit {
        created_at
      }
    }
  }
`;
