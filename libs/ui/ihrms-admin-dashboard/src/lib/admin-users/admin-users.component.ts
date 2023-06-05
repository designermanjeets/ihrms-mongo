import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';
import { IhrmsDialogComponent, MultiChartsComponent } from '@ihrms/ihrms-components';
import { CONSTANTS } from '@ihrms/shared';
import { AdminUsersService } from './_services/admin-users.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ihrms-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit, AfterViewInit {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;
  rowIndexOrID: Subject<any> = new Subject();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _aus: AdminUsersService
  ) {
    this.gridsterOptions = this._aus.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {

    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { field: 'User' },
            { field: 'Email'},
            { field: 'Date Created'},
            { field: 'Company'},
            { field: 'Roles'},
            { field: 'Status'},
            { field: 'HR Module', hide: true },
            { field: 'Employee Module', hide: true },
            { field: 'Task Module', hide: true },
            { field: 'Project Module', hide: true },
            { field: 'Client Module', hide: true },
            { field: 'Job Module', hide: true },
            { field: 'Support Module', hide: true },
            { field: 'Action', cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'visibility' ] }
              }
            },
          ],
          rowData: [
            {
              User: 'Raj',
              Email: 'user@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC', 'DCompany'],
              Roles: ['Admin', 'HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Manjeet',
              Email: 'user2@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC'],
              Roles: ['HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Harry',
              Email: 'user@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC', 'DCompany'],
              Roles: ['Admin', 'HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Anita',
              Email: 'user2@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC'],
              Roles: ['HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'John',
              Email: 'user@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC', 'DCompany'],
              Roles: ['Admin', 'HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Kovit',
              Email: 'user2@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC'],
              Roles: ['HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Mark',
              Email: 'user@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC', 'DCompany'],
              Roles: ['Admin', 'HR'],
              Status: 'Active',
              'HR Module': ['Read', 'Write', 'Delete', 'Import', 'Export'],
              'Employee Module': ['Read', 'Write', 'Import', 'Export'],
              'Task Module': ['Read', 'Import', 'Export'],
              'Project Module': ['Read', 'Import', 'Export'],
              'Client Module': ['Read', 'Import', 'Export'],
              'Job Module': ['Read', 'Write', 'Create', 'Delete', 'Import', 'Export'],
              'Support Module': [],
            },
            {
              User: 'Suraj',
              Email: 'user2@useremail.com',
              'Date Created': moment('2020-06-24 22:57:36').format("YYYY-MM-DD"),
              Company: ['CompABC'],
              Roles: ['HR'],
              Status: 'Active',
            },
          ],
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 100,
        height: 100
      }
    ]

    this.setupDashboardItems();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.VISIBILITY ) {
      this.openAddUserDialog(CONSTANTS.TITLES.User, CONSTANTS.VISIBILITY, event.params.node.id, event.params.data, true);
    }
  }

  setupDashboardItems() {

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Users,
          filterConfig: {
            addButton: false,
            addButtonText: CONSTANTS.TITLES.AddUser,
          },
          compData: this.multiChartData,
          gridComponentFullHeight: true,
        },
        flatItem: false,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.ADD_ANY && event.text === CONSTANTS.TITLES.AddUser) {
        this.openAddUserDialog(event.text, CONSTANTS.ADD_ANY);
      }
    }
  }

  openAddUserDialog(title: string, action: string, rowIndex?: number, patchValue?: any, readOnly?: boolean) {

    const fetchControls = this._aus.getUserDynamicControls();

    patchValue && (patchValue.Username = patchValue.User.username);// For Username field

    const dialogRef = this.dialog.open(IhrmsDialogComponent, {
      data: {
        title: title,
        controls: fetchControls,
        formConfig: {
          okButtonText: 'Close',
          patchValue: patchValue,
          readOnly: readOnly,
          action: action,
        }
      },
      panelClass: 'ihrms-dialog-overlay-panel',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.rowIndexOrID.next({rowIndex: rowIndex, data: result, action: action});
      }
    });
  }

}
