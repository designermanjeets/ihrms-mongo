import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminEmployeesService } from '../admin-employees/_services/admin-employees.service';
import { Router } from '@angular/router';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IhrmsDashbaordAllComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';

@Component({
  selector: 'ihrms-admin-dashbaord-all',
  templateUrl: './admin-dashbaord-all.component.html',
  styleUrls: ['./admin-dashbaord-all.component.scss']
})
export class AdminDashbaordAllComponent implements OnInit {

  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  dashboardData: any | undefined;

  sub!: Subscription;

  updateComponentFromOutside$: Subject<any> = new Subject();

  constructor(
    private cdRef: ChangeDetectorRef,
    private _aes: AdminEmployeesService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService
  ) {
    this.gridsterOptions = this._aes.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.dashboardData = [
      { title: 'Leave Tracker', icon: 'event_note', color: 'default' },
      { title: 'Time Tracker', icon: 'schedule', color: 'default' },
      { title: 'Attendance', icon: 'date_range', color: 'default' },
      { title: 'Performance', icon: 'attribution', color: 'default' },
      { title: 'Files', icon: 'folder_copy', color: 'default' },
      { title: 'Companies', icon: 'business', color: 'default' },
      { title: 'Compensation', icon: 'paid', color: 'default' },
      { title: 'Announcements', icon: 'announcement', color: 'default' },
      { title: 'HR Letters', icon: 'chrome_reader_mode', color: 'default' },
      { title: 'Onboarding', icon: 'insert_invitation', color: 'default' },
    ]

    this.setupDashboardItems();

  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: IhrmsDashbaordAllComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 2,
          title: 'All Services',
          compData: this.dashboardData,
          gridComponentFullHeight: true,
          updateComponent: this.updateComponentFromOutside$,
        },
        flatItem: false,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.item?.title === 'CONSTANTS.IHRMS_FILTERS_COMPONENT') {
      // this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.CREATE_PROFILE}`)
    }
  }

}
