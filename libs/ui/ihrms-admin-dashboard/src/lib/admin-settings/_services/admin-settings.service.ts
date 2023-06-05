import { Injectable } from '@angular/core';
import {
  ControlBase,
  DropdownControl, HeadingControl,
  HiddenControl,
  TextAreaControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminSettingsService {

  getSystemControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'System Settings',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'TimeZone',
        label: 'TimeZone',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: 'UTC + 5:30', value: 'UTC + 5:30' }
        ]
      },
      {
        key: 'DefaultCurrency',
        label: 'Default Currency',
        order: 2,
        controlType: 'dropdown',
        options: [
          { key: 'US Dollar', value: 'US Dollar' },
          { key: 'Australian Dollar', value: 'Australian Dollar' },
          { key: 'Indian Rupees', value: 'Indian Rupees' }
        ]
      },
      {
        key: 'CurrencyPosition',
        label: 'Currency Position',
        order: 3,
        controlType: 'dropdown',
        options: [
          { key: 'Before Amount', value: 'Before Amount' },
          { key: 'After Amount', value: 'After Amount' },
        ]
      },
      {
        key: 'CurrencyDecimals',
        label: 'Currency Decimals',
        order: 4,
        controlType: 'dropdown',
        options: [
          { key: '0', value: '0' },
          { key: '1', value: '1' },
          { key: '2', value: '2' },
        ]
      },
      {
        key: 'TaxDecimals(%) ',
        label: 'Tax Decimals (%) ',
        order: 5,
        controlType: 'dropdown',
        options: [
          { key: '0', value: '0' },
          { key: '1', value: '1' },
          { key: '2', value: '2' },
        ]
      },
      {
        key: 'QuantityDecimals ',
        label: 'Quantity Decimals',
        order: 6,
        controlType: 'dropdown',
        options: [
          { key: '0', value: '0' },
          { key: '1', value: '1' },
          { key: '2', value: '2' },
        ]
      },
      {
        key: 'Date Format ',
        label: 'DateFormat',
        order: 7,
        controlType: 'dropdown',
        options: [
          { key: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          { key: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
          { key: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
          { key: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        ]
      },
      {
        key: 'AutoCloseTicket  ',
        label: 'Auto Close Ticket ',
        order: 8,
        controlType: 'dropdown',
        options: [
          { key: '15 Days', value: '15 Days' },
          { key: '30 Days', value: '30 Days' },
          { key: '45 Days', value: '45 Days' },
        ]
      },
      {
        key: 'TicketDepartment  ',
        label: 'Ticket Department ',
        order: 9,
        controlType: 'dropdown',
        options: [
          { key: 'Networking', value: 'Networking' },
        ]
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getLevelControl() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Max level',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'Level',
        label: 'Level',
        order: 1,
        fxFlex: 24,
        validators: {
          required: true
        },
        controlType: 'textbox',
        type: 'number'
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getExpenseControls() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Expense Approval Settings',
            order: 0,
            controlType: 'controlHeading',
            fxFlex: 100,
            class: ['light-blue-head ml-m-10 mr-m-10']
          },
          {
            key: 'Approver',
            label: 'Approver',
            validators: {
              required: true,
            },
            order: 1,
            fxFlex: 24,
            controlType: 'dropdown',
            options: [
              { key: 'Manager',  value: 'Manager' },
              { key: 'HR Manager',  value: 'HR Manager' }
            ],
          },
          {
            key: '',
            label: 'add',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 2,
            textAlign: 'left'
          },
          {
            key: '',
            label: 'close',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 1,
            textAlign: 'left'
          }
        ]
      }
    ];

    return of(controls);

  }

  getLeaveControls() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Leave Approval Settings',
            order: 0,
            controlType: 'controlHeading',
            fxFlex: 100,
            class: ['light-blue-head ml-m-10 mr-m-10']
          },
          {
            key: 'Approver',
            label: 'Approver',
            validators: {
              required: true,
            },
            order: 1,
            fxFlex: 24,
            controlType: 'dropdown',
            options: [
              { key: 'Manager',  value: 'Manager' },
              { key: 'HR Manager',  value: 'HR Manager' }
            ],
          },
          {
            key: '',
            label: 'add',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 2,
            textAlign: 'left'
          },
          {
            key: '',
            label: 'close',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 1,
            textAlign: 'left'
          }
        ]
      }
    ];

    return of(controls);

  }

  getOfferControls() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Offer Approval Settings',
            order: 0,
            controlType: 'controlHeading',
            fxFlex: 100,
            class: ['light-blue-head ml-m-10 mr-m-10']
          },
          {
            key: 'Approver',
            label: 'Approver',
            validators: {
              required: true,
            },
            order: 1,
            fxFlex: 24,
            controlType: 'dropdown',
            options: [
              { key: 'Manager',  value: 'Manager' },
              { key: 'HR Manager',  value: 'HR Manager' }
            ],
          },
          {
            key: '',
            label: 'add',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 2,
            textAlign: 'left'
          },
          {
            key: '',
            label: 'close',
            order: 1,
            controlType: 'addEditButton',
            buttonType: 'icon',
            marginTop: 24,
            fxFlex: 1,
            textAlign: 'left'
          }
        ]
      }
    ];

    return of(controls);

  }

  getLeaveSettingsControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Leave Type',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Leave Type Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'days',
        label: 'Days',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
        type: 'number'
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'carryForward',
        label: 'Carry Forward',
        order: 1,
        validators: {
          required:true,
          
        },
        controlType: 'radioGroup',
        value: false,
        options: [
          { key: true, value: 'Yes' },
          { key: false, value: 'No' },
        ]
      },
      {
        key: 'carryForwardDays',
        label: 'Carry Forward Day',
        order: 1,
        controlType: 'textbox',
        type: 'number'
      },
      {
        label: 'Count Weekend days when employee request Leave',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: 'countWeekends',
        label: 'Count Weekend',
        order: 1,
        controlType: 'radioGroup',
        value: false,
        options: [
          { key: true, value: 'Yes' },
          { key: false, value: 'No' },
        ]
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
        order: 1,
        fxFlex: 100,
        controlType: 'textarea',
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getEmployeeTypeControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Employee Type',
        order: 0,
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
        label: 'Employee Type Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
     
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ],
      },
      {
        key: 'CustomPolicy',
        label: 'Add Custom Policy',
        order: 1,
        controlType: 'fileUpload',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
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

  getBloodGroupControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Blood Group',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Blood Group Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
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

  getCastControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Cast',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Cast Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
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

  getMaritalStatusControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'MaritalStatus',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Marital Status Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getModeOfEmploymentControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Mode Of Employment',
        order: 0,
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
        label: 'Mode Of Employment',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ],
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        key: 'comments',
        label: 'Comments',
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

  getRelationControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Relation',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Relation Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getStatusControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Status',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Status Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'code',
        label: 'Status Code',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: '',
        fxFlex: 49
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
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

  getTitleControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Title',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      },
      {
        key: 'id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Title Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
        fxFlex: 100
      },
      {
        key: 'comments',
        label: 'Comments',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getShiftTypeControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Title',
        order: 0,
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
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'code',
        label: 'Shift Code',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ],
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        key: 'comments',
        label: 'Comments',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getJobTitleControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Title',
        order: 0,
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
        label: 'Job Title Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
      },
      {
        key: 'designationId',
        label: 'Designation',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      },
      {
        key: 'status',
        label: 'Status',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ]
      },
      {
        label: '',
        order: 1,
        controlType: 'controlHeading',
      },
      {
        key: 'comments',
        label: 'Comments',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textarea',
        fxFlex: 100,
      },
    ];

    return of(controls.sort((a, b) => a.order - b.order));

  }

  getRoleControls() {

    const controls: ControlBase<string>[] = [

      new HiddenControl({
        key: '_id',
        label: 'ID',
        order: 1,
      }),

      new HeadingControl({
        label: 'Role Setting',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      }),

      new TextBoxControl({
        key: 'role_name',
        label: 'Role',
        validators: {
          required: true,
        },
        order: 1,
      }),

      new DropdownControl({
        key: 'isDefault',
        label: 'is Default',
        validators: {
          required: true,
        },
        order: 1,
        options: [
          { key: true, value: 'True' },
          { key: false, value: 'False' }
        ]
      }),

      new DropdownControl({
        key: 'status',
        label: 'is Active',
        validators: {
          required: true,
        },
        order: 1,
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'InActive' }
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

  getPermissionControls() {

    const controls: ControlBase<string>[] = [
      {
        label: 'Add Permission to Role',
        order: 0,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10']
      },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'role_name',
        label: 'Role Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'dropdown',
        options: []
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

  getGoalSettingControls() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Create Goal',
            order: 0,
            controlType: 'controlHeading',
            fxFlex: 100,
            class: ['light-blue-head ml-m-10 mr-m-10']
          },
          {
            key: 'goal',
            label: 'Goal',
            validators: {
              required: true,
            },
            order: 1,
            controlType: 'textbox',
          },
          {
            key: 'status',
            label: 'Status',
            order: 1,
            controlType: 'dropdown',
            options: [
              { key: 'Start', value: 'Start' },
              { key: 'In-Progress', value: 'In-Progress' },
              { key: 'Completed', value: 'Completed' }
            ],
          },
          {
            key: 'dueDate',
            label: 'Due Date',
            order: 1,
            controlType: 'datepicker',
          },
          {
            key: 'associatedPerformanceDiscussions',
            label: 'Associated Performance Discussions',
            order: 1,
            controlType: 'dropdown',
            type: 'multiple',
            options: [],
          },
          {
            key: 'description',
            label: 'Description',
            validators: {
              required: true,
            },
            order: 1,
            controlType: 'textarea',
          },
          {
            key: '',
            label: 'Add Goal',
            order: 1,
            controlType: 'addEditButton',
            marginTop: 24,
            fxFlex: 10,
            textAlign: 'left',
            type: 'add'
          },
          {
            key: '',
            label: 'Remove Goal',
            order: 1,
            controlType: 'addEditButton',
            marginTop: 24,
            fxFlex: 10,
            textAlign: 'left',
            type: 'remove'
          }
        ]
      }
    ];

    return of(controls);

  }

  
  getKeyPerformanceEventsControls() {

    const controls: ControlBase<string>[] | any = [ // Type Any for Array of Controls
      {
        dynamicArr : [
          {
            label: 'Key Performance Events',
            order: 0,
            controlType: 'controlHeading',
            fxFlex: 100,
            class: ['light-blue-head ml-m-10 mr-m-10']
          },
          {
            key: 'eventName',
            label: 'Event Name',
            validators: {
              required: true,
            },
            order: 1,
            controlType: 'textbox',
          },
          {
            key: 'status',
            label: 'Status',
            order: 1,
            controlType: 'dropdown',
            options: [
              { key: 'Start', value: 'Start' },
              { key: 'In-Progress', value: 'In-Progress' },
              { key: 'Completed', value: 'Completed' }
            ],
          },
          {
            key: 'fromDate',
            label: 'From Date',
            order: 1,
            controlType: 'datepicker',
          },
          {
            key: 'toDate',
            label: 'To Date',
            order: 1,
            controlType: 'datepicker',
          },
          {
            key: 'description',
            label: 'Description',
            validators: {
              required: true,
            },
            order: 1,
            controlType: 'textarea',
          },
          {
            key: '',
            label: 'Add Event',
            order: 1,
            controlType: 'addEditButton',
            marginTop: 24,
            fxFlex: 10,
            textAlign: 'left',
            type: 'add'
          },
          {
            key: '',
            label: 'Remove Event',
            order: 1,
            controlType: 'addEditButton',
            marginTop: 24,
            fxFlex: 10,
            textAlign: 'left',
            type: 'remove'
          }
        ]
      }
    ];

    return of(controls);

  }

}

export const GQL_LEAVE_TYPES = gql`
  query result(
      $query: Pagination!				
  ) {
    getLeaveTypes(
        query: $query
    ) {
      _id
      name
      days
      carryForward
      carryForwardDays
      countWeekends
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_CREATE_LEAVE_TYPE = gql`
  mutation leaveTypeMutation(
    $name: String!
    $days: Int!
    $carryForward: Boolean
    $carryForwardDays:Int
    $countWeekends: Boolean
    $status: Boolean
    $comments: String
    
  ) {
    createLeaveType(
      name: $name
      days: $days
      carryForward: $carryForward
      carryForwardDays: $carryForwardDays
      countWeekends: $countWeekends
      status: $status
      comments: $comments
    ) {
      _id
      name
      days
      carryForward
      carryForwardDays
      countWeekends
      status
      
      comments
      audit {
        modified_at
      }       
    }
  }
`;

export const GQL_EDIT_LEAVE_TYPE = gql`
  mutation leaveTypeMutation(
    $id: ID
    $name: String!
    $days: Int!
    $carryForward: Boolean
    $carryForwardDays:Int
    $countWeekends: Boolean
    $status: Boolean
    $comments: String
  ) {
    editLeaveType(
      _id: $id
      name: $name
      days: $days
      carryForward: $carryForward
      carryForwardDays: $carryForwardDays
      countWeekends: $countWeekends
      status: $status
      comments: $comments
    ) {
      _id
      name
      days
      carryForward
      carryForwardDays
      countWeekends
      status
      comments
      audit {
        modified_at
      }       
    }
  }
`;


export const GQL_ROLES = gql`
  query result(
    $query: Pagination!
  ) {
    getRoles(
      query: $query
    ) {
      _id
      role_name
      status
      isDefault
      comments
      privileges {
        module {
          name
          sub_module {
            db
            name
            iconName
            isChild
            url
            actions {
              add
              edit
              show
              delete
              authorize
              cancel
              import
              export
            }
          }
        }
      }
      audit {
        created_at
      }
      
    }
  }
`;

export const GQL_CREATE_ROLE = gql`
  mutation createRole(
    $role_name: String!
    $status: Boolean
    $isDefault: Boolean
    $comments: String
    $privileges: privilegesInputs
    $audit: auditInputs
  ) {
    createRole(
      role_name: $role_name
      status: $status
      isDefault: $isDefault
      comments: $comments
      privileges: $privileges
      audit: $audit
    ) {
      role_name
      status
      isDefault
      comments
      privileges {
        module {
          name
          iconName
          isChild
          url
          sub_module
          {
            name
            isChild
            actions{
              show
              add
              edit
            }
          }
        }
      }
      audit {
        created_at
        modified_at
      }
    }
  }
`;

export const GQL_EDIT_ROLE = gql`
  mutation editRole(
    $id: ID
    $role_name: String!
    $status: Boolean
    $isDefault: Boolean
    $comments: String
    $privileges: privilegesInputs
    $audit: auditInputs
  ) {
    editRole(
      _id: $id
      role_name: $role_name
      status: $status
      isDefault: $isDefault
      comments: $comments
      privileges: $privileges
      audit: $audit
    ) {
      _id
      role_name
      status
      isDefault
      comments
      privileges {
        module {
          name
          iconName
          url
          isChild
          sub_module
          {
            name
            isChild
            iconName
            url
            actions{
              show
              add
              edit
            }
          }
        }
      }
      audit {
        created_at
        modified_at
      }
    }
  }
`;