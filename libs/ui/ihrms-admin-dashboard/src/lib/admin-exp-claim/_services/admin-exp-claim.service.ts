import { Injectable } from '@angular/core';
import { ControlBase, DatePickerControl, DropdownControl, HiddenControl, TextAreaControl, TextBoxControl } from '@ihrms/ihrms-dynamic-forms';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminExpClaimService {

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
        setTimeout( (_: any) => _this.gridResize.next(item), 500); // Sometimes Buggy
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => _this.gridResize.next(GridsterComponent), 500); // Sometimes Buggy
      }
    };
  }

  // TODO: get from a remote source of controls metadata
  getRequestLoanDynamicControls() {

    const controls: ControlBase<string>[] = [

      new HiddenControl({
        key: '_id',
        label: '_id',
        order: 1,
        fxFlex: 48
      }),

      new TextBoxControl({
        key: 'userCtrl',
        label: 'User',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48
      }),

      new TextBoxControl({
        key: 'loanAmount',
        label: 'Loan Amount',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48
      }),

      new DropdownControl({
        key: 'loanType',
        label: 'Loan Type',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        options:[
          { key: 'Advance', value: 'Advance' },
          { key: 'Others', value: 'Others' },
        ]
      }),

      new DropdownControl({
        key: 'EMI',
        label: 'EMI',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        options:[
          { key: '3', value: '3' },
          { key: '6', value: '6' },
          { key: '9', value: '9' },
        ]
      }),

      new DropdownControl({
        key: 'period',
        label: 'Period',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        options:[
          { key: '3', value: '3' },
          { key: '6', value: '6' },
          { key: '9', value: '9' },
        ]
      }),

      new DatePickerControl({
        key: 'date',
        label: 'Date',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48
      }),

      new TextBoxControl({
        key: 'toManagerCtrl',
        label: 'To',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        disabled: true
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

  // TODO: get from a remote source of controls metadata
  getRequestClaimDynamicControls() {

    const controls: ControlBase<string>[] = [

      new HiddenControl({
        key: '_id',
        label: '_id',
        order: 1,
        fxFlex: 48
      }),

      new TextBoxControl({
        key: 'claimAmount',
        label: 'Claim Amount',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48
      }),

      new TextBoxControl({
        key: 'userCtrl',
        label: 'User',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48
      }),

      new DropdownControl({
        key: 'claimType',
        label: 'Claim Type',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        options:[
          { key: 'Business', value: 'Business' },
          { key: 'Travel', value: 'Travel' },
          { key: 'Others', value: 'Others' },
        ]
      }),

      new DatePickerControl({
        key: 'date',
        label: 'Select Date',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
      }),

      new TextBoxControl({
        key: 'toManagerCtrl',
        label: 'To',
        validators: {
          required: true,
        },
        order: 1,
        fxFlex: 48,
        disabled: true
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

export const GQL_EXPENSE_CLAIM = gql`
  query GetExpenseClaims($query: Pagination!) {
    getExpenseClaims(query: $query) {
      _id
      claimAmount
      claimType
      comments
      date
      status
      toManager {
        _id
        username
      }
      audit {
        created_at
      }
      user {
        _id
        username
      }
    }
  }
`;

export const GQL_EXPENSE_CLAIM_UPDATE = gql`
  mutation EditExpenseClaims(
    $_id: ID!,
    $claimType: String!, 
    $claimAmount: Int!, 
    $date: ISODate!, 
    $toManagerID: ID, 
    $status: String,
    $comments: String,
    $userId: ID!
  ) {
    editExpenseClaims(
      _id: $_id,
      claimType: $claimType, 
      claimAmount: $claimAmount, 
      date: $date, 
      toManagerID: $toManagerID, 
      comments: $comments,
      status: $status,
      userId: $userId
    ) {
      _id
      claimAmount
      claimType
      comments
      date
      status
      toManager {
        _id
        username
      }
      audit {
        created_at
      }
      user {
        _id
        username
      }
    }
  }
`;

export const GQL_LOAN_ADVANCES_UPDATE = gql`
  mutation LoanUpdateMutation(
    $_id: ID!,
    $userId: ID!, 
    $loanType: String!, 
    $loanAmount: Int!, 
    $date: ISODate!, 
    $period: Int, 
    $EMI: Int, 
    $status: String,
    $toManagerID: ID, 
    $comments: String
  ) {
    editLoanAdvances(
      _id: $_id,
      userId: $userId, 
      loanType: $loanType, 
      loanAmount: $loanAmount, 
      date: $date, 
      period: $period, 
      EMI: $EMI,
      status: $status,
      toManagerID: $toManagerID, 
      comments: $comments
    ) {
      _id
      loanAmount
      loanType
      outstanding
      period
      status
      EMI
      toManager {
        _id
        username
      }
      user {
        _id
        username
      }
      audit {
        created_at
      }
      date
    }
  }
`;

export const GQL_LOAN_ADVANCES = gql`
  query GetLoanAdvances($query: Pagination!) {
    getLoanAdvances(query: $query) {
      _id
      EMI
      comments
      date
      loanAmount
      loanType
      outstanding
      period
      status
      toManager {
        _id
        username
      }
      user {
        _id
        username
      }
      audit {
        created_at
      }
    }
  }
`;
