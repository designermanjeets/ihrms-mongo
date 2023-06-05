import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AdminEmployeesService {

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

export const GQL_EMPLOYEE_UPLOAD = gql`
  mutation UploadMutation(
    $file: Upload!
  ) {
    uploadFile(
      file: $file
    )
  }
`;

export const GQL_UPLOAD_EMPLOYEE_DETAILS = gql`
mutation InsertManyMutation(
  $input: Void!
) {
  insertManyUsers(input: $input)
}
`;
