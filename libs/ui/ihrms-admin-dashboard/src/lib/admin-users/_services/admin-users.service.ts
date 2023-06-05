import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import {
  ControlBase,
  DropdownControl, HeadingControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

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
  getUserDynamicControls() {

    const controls: ControlBase<string>[] = [

      new TextBoxControl({
        key: 'Username',
        label: 'Username',
        validators: {
          required: true,
        },
        order: 1
      }),

      new TextBoxControl({
        key: 'Email',
        label: 'Email',
        validators: {
          required: true,
        },
        order: 2,
      }),

      new TextBoxControl({
        key: 'Password',
        label: 'Password',
        validators: {
          required: true,
        },
        order: 3,
      }),

      new TextBoxControl({
        key: 'Confirm Password',
        label: 'Confirm Password',
        validators: {
          required: true,
        },
        order: 4,
      }),

      new TextBoxControl({
        key: 'Phone',
        label: 'Phone',
        order: 5,
      }),

      new DropdownControl({
        key: 'Roles',
        label: 'Roles',
        validators: {
          required: true,
        },
        order: 6,
        type: 'multiple',
        options: [
          { key: 'Admin', value: 'Admin' },
          { key: 'HR', value: 'HR' },
          { key: 'User', value: 'User' },
          { key: 'Agent', value: 'Agent' },
        ]
      }),

      new DropdownControl({
        key: 'Company',
        label: 'Company',
        validators: {
          required: true,
        },
        order: 7,
        type: 'multiple',
        options: [
          { key: 'CompanyABC', value: 'CompanyABC' },
          { key: 'DCompany', value: 'DCompany' },
        ]
      }),

      new DropdownControl({
        key: 'Status',
        label: 'Status',
        order: 8,
        options: [
          { key: 'Active', value: 'Active' },
          { key: 'Inactive', value: 'Inactive' },
        ],
      }),

      new DropdownControl({
        key: '',
        label: '',
        order: 9,
      }),

      new HeadingControl({
        label: 'Module Permissions',
        order: 9,
        controlType: 'controlHeading',
        fxFlex: 100,
        class: ['light-blue-head ml-m-10 mr-m-10']
      }),

      new DropdownControl({
        key: 'HR Module',
        label: 'HR Module',
        order: 10,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Employee Module',
        label: 'Employee Module',
        order: 11,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Task Module',
        label: 'Task Module',
        order: 12,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Project Module',
        label: 'Project Module',
        order: 13,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Client Module',
        label: 'Client Module',
        order: 14,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Job Module',
        label: 'Job Module',
        order: 15,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),

      new DropdownControl({
        key: 'Support Module',
        label: 'Support Module',
        order: 16,
        type: 'multiple',
        options: [
          { key: 'Read', value: 'Read' },
          { key: 'Write', value: 'Write' },
          { key: 'Create', value: 'Create' },
          { key: 'Delete', value: 'Delete' },
          { key: 'Import', value: 'Import' },
          { key: 'Export', value: 'Export' },
        ]
      }),
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}
