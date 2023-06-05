import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import {
  CompanyNotificationsComponent,
  CreatePostComponent,
  NotificationConfig,
  NotificationItem, notificationItems
} from '@ihrms/ihrms-components';
import { CreateAdminPostService } from './_services/create-admin-post.service';

@Component({
  selector: 'ihrms-create-admin-post',
  templateUrl: './create-admin-post.component.html',
  styleUrls: ['./create-admin-post.component.scss']
})
export class CreateAdminPostComponent implements OnInit, AfterViewInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  notificationItems: NotificationItem[] = notificationItems;
  config: NotificationConfig = {
    title: 'Posts',
    closeable: false,
    flatInsideCard: true
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private _cap: CreateAdminPostService
  ) {
    this.gridsterOptions = this._cap.getGridsterOptions(this.cardSize, this);
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
          cardRadius: 20
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

  dynamicCompClickHandler(event: any, _this: CreateAdminPostComponent) {
    console.log(event);
  }
}
