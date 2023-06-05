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
export class AdminCompaniesService {

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
        label: 'Company Name',
        validators: {
          required: true,
        },
        order: 1,
      }),

      new TextBoxControl({
        key: 'printName',
        label: 'Print Name',
        validators: {
          required: true,
        },
        order: 1,
      }),

      new TextBoxControl({
        key: 'email',
        label: 'Email',
        order: 1,
      }),

      new TextBoxControl({
        key: 'adminEmailAddress',
        label: 'Admin Email Address',
        order: 1,
      }),

      new TextBoxControl({
        key: 'connectionString',
        label: 'Connection String',
        order: 1,
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

export const GQL_TENANTS = gql`
  query result(
    $query: Pagination!
  ) {
    getTenants(
      query: $query
    ) {
      _id
      name
      email
      printName
      adminEmailAddress
      connectionString
      status
      comments
      audit {
        created_at
      }
    }
  }
`;

export const GQL_CREATE_TENANT = gql`
  mutation createTenantMutation(
    $name: String!
    $email: String
    $printName: String
    $adminEmailAddress: String
    $connectionString: String
    $status: Boolean
    $comments: String
  ) {
    createTenant(
      name: $name
      email: $email
      printName: $printName
      adminEmailAddress: $adminEmailAddress
      connectionString: $connectionString
      status: $status
      comments: $comments
    ) {
      _id
      name
      email
      printName
      adminEmailAddress
      connectionString
      comments
      audit {
        created_at
      }
      status
    }
  }
`;

export const GQL_UPDATE_TENANT = gql`
  mutation editTenantMutation(
    $id: ID!
    $name: String!
    $email: String
    $printName: String
    $adminEmailAddress: String
    $connectionString: String
    $status: Boolean
    $comments: String
  ) {
    editTenant(
      _id: $id
      name: $name
      email: $email
      printName: $printName
      adminEmailAddress: $adminEmailAddress
      connectionString: $connectionString
      status: $status
      comments: $comments
    ) {
      _id
      name
      email
      printName
      adminEmailAddress
      connectionString
      comments
      audit {
        created_at
      }
      status
    }
  }
`;