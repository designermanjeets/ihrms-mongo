import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminLeavesService {

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
        setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
      },
      itemResizeCallback: (item: GridsterItem) => {
        // update DB with new size
        setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => _this.gridResize.next(true), 500); // Sometimes Buggy
      }
    };
  }

}

export const GQL_LEAVE_REQUESTS = gql`
  query GetLeaveRequests(
    $query: Pagination!
  ) {
    getLeaveRequests(
      query: $query
    ) {
      _id
      userID
      user {
        username
        unitDepartment {
          name
        }
        designation {
          name
        }
      }
      leaveTypeBalance
      approvers {
        approverID
        approverECode
        approverName
        approverStatus
        approverLevel
      }
      startDate
      endDate
      days
      leaveType {
        name
      }
      toManager {
        username
      }
      status
      comments
      leaveType {
        name
      }
      audit {
        created_at
      }
    }
  }
`;


export const GQL_LEAVE_BALANCE = gql`
  query LeaveBalanceQuery($query: Pagination!) {
    getLeaveBalance(query: $query)
  }
`;

export const GQL_LEAVE_APPROVE_REJECT = gql`
  mutation leaveRequestApproveRejectMutation(
    $id: ID!
    $userID: ID!
    $startDate: ISODate!
    $endDate: ISODate!
    $days: Int!
    $leaveTypeID: ID
    $toManagerID: ID
    $status: String
    $comments: String
    $approvers: [ApproverInputs]
  ) {
    approveRejectLeaveRequest(
      _id: $id
      userID: $userID
      startDate: $startDate
      endDate: $endDate
      days: $days
      leaveTypeID: $leaveTypeID
      toManagerID: $toManagerID
      approvers: $approvers
      status: $status
      comments: $comments
    ) {
      _id
      startDate
      endDate
      days
      leaveTypeID
      toManagerID
      comments
      audit {
        created_at
      }
      status
    }
  }
`;