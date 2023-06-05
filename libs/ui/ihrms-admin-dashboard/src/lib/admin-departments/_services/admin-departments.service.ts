import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import {
  ControlBase,
  DropdownControl, HiddenControl,
  TextAreaControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminDepartmentsService {

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
      // {
      //   label: 'Department',
      //   order: 1,
      //   controlType: 'controlHeading',
      //   fxFlex: 100,
      //   class: ['light-blue-head ml-m-10']
      // },
      {
        key: '_id',
        label: 'ID',
        order: 1,
        controlType: 'hidden',
      },
      {
        key: 'name',
        label: 'Department Name',
        validators: {
          required: true,
        },
        order: 1,
        controlType: 'textbox',
        protected: true,
        fxFlex: 48
      },
      {
        key: 'departmentLeadId',
        label: 'Department Lead',
        validators: {
        },
        order: 1,
        controlType: 'dropdown',
        options: [],
        fxFlex: 48
      },
      {
        key: 'parentDepartmentId',
        label: 'Parent Department',
        validators: {
        },
        order: 1,
        controlType: 'dropdown',
        options: [],
        fxFlex: 48
      },
      {
        key: 'leaveTypesIDs',
        label: 'Leave Types',
        validators: {
            required:false,
        },
        order: 1,
        controlType: 'dropdown',
        options: [],
        type: 'multiple',
        fxFlex: 48
      },
      {
        key: 'status',
        label: 'Status',
       // validators: {
         // required: true,
       // },
        order: 1,
        controlType: 'dropdown',
        options: [
          { key: true, value: 'Active' },
          { key: false, value: 'Inactive' }
        ],
        value: 1,
        fxFlex: 48
      },
      {
        key: 'comments',
        label: 'Comments',
        order: 1,
        fxFlex: 100,
        controlType: 'textarea',
      }
    ];

    return of(controls.sort((a, b) => a.order - b.order));
  }

}

export const GQL_DEPARTMENTS = gql`
  query result(
    $query: Pagination!
  ) {
    getDepartments(
      query: $query
    ) {
      _id
      name
      departmentLeadId
      departmentLead {
        eCode
        username
      }
      parentDepartmentId
      parentDepartment {
        name
      }
      leaveTypesIDs
      leaveTypes {
        _id
        name
      }
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_CREATE_DEPARTMENTS = gql`
mutation departmentMutation(
  $name: String!
  $departmentLeadId: ID
  $parentDepartmentId: ID
  $leaveTypesIDs: [ID]
  $status: Boolean
  $comments: String
) {
  createDepartment(
    name: $name
    departmentLeadId: $departmentLeadId
    parentDepartmentId: $parentDepartmentId
    leaveTypesIDs: $leaveTypesIDs
    status: $status
    comments: $comments
  ) {
    _id
    name
    departmentLeadId
    parentDepartmentId
    leaveTypes {
      _id
      name
    }
    departmentLead {
      username
    }
    parentDepartmentId
    parentDepartment {
      name
    }
    comments
    audit {
      created_at
    }
    status
  }
}
`;


export const GQL_UPDATE_DEPARTMENTS = gql`
mutation departmentMutation(
  $id: ID
  $name: String!
  $departmentLeadId: ID
  $parentDepartmentId: ID
  $leaveTypesIDs: [ID]
  $status: Boolean
  $comments: String
) {
  editDepartment(
    _id: $id
    name: $name
    departmentLeadId: $departmentLeadId
    parentDepartmentId: $parentDepartmentId
    status: $status
    leaveTypesIDs: $leaveTypesIDs
    comments: $comments
  ) {
    _id
    name
    status
    departmentLeadId
    parentDepartmentId
    departmentLead {
      username
    }
    parentDepartmentId
    parentDepartment {
      name
    }
    leaveTypes {
      _id
      name
    }
    comments
    audit {
      modified_at
      created_at
    }         
  }
}
`;
