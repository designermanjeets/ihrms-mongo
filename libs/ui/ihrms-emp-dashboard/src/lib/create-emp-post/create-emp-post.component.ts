import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { CreateEmpPostService } from './_services/create-emp-post.service';
import {
  CompanyNotificationsComponent,
  CreatePostComponent, NotificationConfig, NotificationItem, notificationItems
} from '@ihrms/ihrms-components';

@Component({
  selector: 'ihrms-create-emp-post',
  templateUrl: './create-emp-post.component.html',
  styleUrls: ['./create-emp-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEmpPostComponent implements OnInit, AfterViewInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  notificationItems: NotificationItem[]  = notificationItems;
  config: NotificationConfig = {
    title: 'Posts',
    closeable: false,
    flatInsideCard: true,
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private _cep: CreateEmpPostService
  ) {
    this.gridsterOptions = this._cep.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.setupDashboardItems();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: CreatePostComponent,
        gridsterItem: { cols: 3, rows: 1, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      },
      {
        dynamicComponent: CompanyNotificationsComponent,
        gridsterItem: { cols: 2, rows: 1.5, y: 0, x: 3 },
        inputs: {
          cardRadius: 20,
          palette: 'primary',
          config: this.config,
          notificationItems: this.notificationItems
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler, args: ['$event', this] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any, _this: CreateEmpPostComponent) {
    console.log(event);
  }

}
