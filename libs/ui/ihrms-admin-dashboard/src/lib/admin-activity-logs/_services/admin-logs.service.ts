import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminLogsService {

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

}

export const GQL_ACTIVITY_LOGS = gql`
  query GetActivityLogs($query: Pagination!) {
    getActivityLogs(query: $query) {
      _id
      change_history {
        change_table
        change_type
        changedFields
        request_parameters
        new_object
        old_object
      }
      event_summary {
        event_initiated_by_user
        operation_name
        status
        tenant_id
        timestamp,
        success_or_error_msg
      }
    }
  }
`;
