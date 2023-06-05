import { Injectable } from '@angular/core';
import { CompactType, DisplayGrid, GridsterItem, GridType } from 'angular-gridster2';

@Injectable({
  providedIn: 'root'
})
export class EmpGoalsPerformaService {
  
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

}
