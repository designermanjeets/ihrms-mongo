import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import {
  ControlBase,
  DropdownControl,
  HiddenControl,
  TextAreaControl,
  TextBoxControl
} from '@ihrms/ihrms-dynamic-forms';
import { of } from 'rxjs';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminDesignationsService {

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

      new HiddenControl({
        key: '_id',
        label: 'ID',
        order: 1,
      }),

      new TextBoxControl({
        key: 'name',
        label: 'Designation',
        validators: {
          required: true,
        },
        protected: true,
        order: 1,
      }),

      new DropdownControl({
        key: 'departmentId',
        label: 'Department',
        validators: {
          required: true,
        },
        protected: true,
        order: 1,
        options: []
      }),

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
        ],
        value: 1,
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
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_DESIGNATIONS = gql`
  query result(
    $query: Pagination!
  ) {
    getDesignations(
      query: $query
    ) {
      _id
      name
      departmentId
      department {
        name
      }
      parentDesignationId
      parentDesignation {
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

export const GQL_UPDATE_DESIGNATION = gql`
  mutation designationMutation(
    $id:ID
    $name:String!
    $departmentId: ID
    $status:Boolean
    $comments:String
  ) {
    editDesignation(
      _id: $id
      name: $name
      departmentId: $departmentId
      status: $status
      comments: $comments
    ) {
      _id
      name
      departmentId
      department {
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

export const GQL_CREATE_DESIGNATION = gql`
  mutation designationMutation(
    $name: String!
    $status: Boolean
    $comments: String
    $departmentId:ID
  ) {
    createDesignation(
      name: $name
      status: $status
      comments: $comments
      departmentId:$departmentId
    ) {
      _id
      name
      comments
      department {
        name
      }
      audit {
        created_at
        
      }       
    }
  }
`;
