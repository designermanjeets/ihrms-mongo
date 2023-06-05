import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { CompactType, DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { IhrmsDashboardItem } from '@ihrms/shared';

@Component({
  selector: 'ihrms-gridster',
  templateUrl: './ihrms-gridster.component.html',
  styleUrls: ['./ihrms-gridster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IhrmsGridsterComponent implements OnInit {

  @Input() gridsterOptions: GridsterConfig = {};
  @Input() dashboardItems: Array<IhrmsDashboardItem> | undefined;
  @Input() resize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('gridster') gridster: GridsterComponent | undefined;

  resizeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();
  changeEvent: EventEmitter<GridsterItem> = new EventEmitter<GridsterItem>();

  ngOnInit(): void {

    this.gridsterOptions || (this.gridsterOptions = {
      fixedRowHeight: 305,
      gridType: GridType.VerticalFixed,
      compactType: CompactType.CompactUp,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: true
      },
      resize: {
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
        // send the update to widgets
        this.changeEvent.emit(item);
      },
      itemResizeCallback: (item: GridsterItem) => {
        // update DB with new size
        // send the update to widgets
        this.resizeEvent.emit(item);
      },
      initCallback: (GridsterComponent: any) => {
        setTimeout( (_: any) => window.dispatchEvent(new Event('resize')), 500);
      }
    });

    this.resize$.subscribe(val => window.dispatchEvent(new Event('resize')));

  }

}
