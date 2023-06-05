/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, map, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import { CONSTANTS } from '@ihrms/shared';
import { IhrmsDialogComponent, GQL_EMPLOYEES, GQL_SHIFTS, MultiChartsComponent } from '@ihrms/ihrms-components';
import { AdminDutyRosterService, GQL_ROSTERS, GQL_SWAP_SHIFT, GQL_ROSTER_UPLOAD } from './_services/admin-duty-roster.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { Apollo } from 'apollo-angular';
import { Validators } from '@angular/forms';
import { GQL_DEPARTMENTS } from '../admin-departments/_services/admin-departments.service';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-admin-duty-roster',
  templateUrl: './admin-duty-roster.component.html',
  styleUrls: ['./admin-duty-roster.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminDutyRosterComponent implements OnInit, AfterViewInit, OnDestroy {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems: Array<GridsterItem> | any;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  multiChartData: any | undefined;
  gridApi!: GridApi;
  columnApi!: ColumnApi;
  rowCurrentSelected: number | undefined | null;
  rowIndexOrID: Subject<any> = new Subject();
  updateMultiComp$: Subject<any> = new Subject();

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  currDutyRoster: any;

  sub!: Subscription;

  staticRosterData: any;

  @ViewChild('gridHeaderTemplate', { static: true }) gridHeaderTemplate!: TemplateRef<any>;
  // Upload
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  fileToUpload!: File;
  user1Options: any;
  user2Options: any;
  shift1Options: any;
  shift2Options: any;
  departmentOptions: any;
  allRosters: any;
  rostersData: any | undefined;
  rosterBtnText = CONSTANTS.ADD;
  rostersGridApi!: GridApi;
  rostersGridColumnApi!: ColumnApi;
  rosterRowCurrentSelected!: number;
  rosterRowIndexOrID: Subject<any> = new Subject();
  hide_show_add_button: any;
  hide_show_import_button: any;
  hide_show_export_button: any;

  filterConfig: any;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private _adrs: AdminDutyRosterService,
    private router: Router,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private _ads: IhrmsAdminDashboardService,
    private toastrService: ToastrService,
    private _adrstrs: AdminDutyRosterService,
    private apollo: Apollo,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._adrs.getGridsterOptions(this.cardSize, this);
  }
  ngOnInit(): void {

    this.staticRosterData = (this._adrstrs.getStaticRosterData()).data.createShiftRoster.roster;
    this.multiChartData = [
      {
        title: "",
        columnFit: true,
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: true,
        gridData: {
          columnDefs: [],
          rowData: [],
          editType: '',
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 100,
        height: 100
      }
    ]

    this.rostersData = {
      title: '',
      pagination: true,
      columnFit: false,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [],
        rowData: [],
        updateGridFromOutside: this.rosterRowIndexOrID,
      },
      flex: 100
    };

    this.setupDashboardItems();

    this.getDutyRosters();

    this.getShifts();

    this.getDepartments();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getDutyRosters() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROSTERS, variables: { query: { limit: 100 } } }).valueChanges
      .pipe(map((data: any) => data?.data?.getShiftRosters))
      .subscribe(val => {
        const all_rosters = _.cloneDeep(val);
        const updatedArray = _(all_rosters).groupBy('month').value();
        const result: any = [];
        _.forEach(updatedArray, arr => {
          result.push(_.mergeWith(
            {},
            ...arr, (objValue: any, srcValue: any, key: any) => {
              return (objValue || []).concat(srcValue) // key === 'users' ? 
            }));
        })

        _.forEach(result, (roster, idx) => {
          // Reset Default Cols 
          roster.columnDefs = [{ field: 'month', cellRenderer: (data: any) => moment(data.value).format('MMMM-YYYY') }, { field: 'eCode' }, { field: 'username' }, { field: 'department' }];
          // Generate Cols based on dates in Roster 
          roster.users[0].dateRange.forEach((date: any) => roster.columnDefs.push({ field: moment(date.date).format('DD-MMM-YY') }));
          // Destructure Date Range Data 
          _.forEach(roster.users, (user, idx) => _.forEach(user.dateRange, (d, ijx) => roster.users[idx][moment(d.date).format('DD-MMM-YY')] = d.shifts));
          result[idx].month = roster.month.length ? roster.month[0]: roster.month;
          this.allRosters = result;
        });
      });
  }

  getUsersByDepartmets(departID: string, controlsObj: any) {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 100, 
      departmentId: departID,
      approvers:  [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
    } } }).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => {
        if (val) {
          this.user1Options = _.cloneDeep(val);
          this.user2Options = _.cloneDeep(val);
          this._ihrmsadss.getSelectOptions(controlsObj, this.user1Options, 'fromUsereCode', 'eCode', 'username');
          this._ihrmsadss.getSelectOptions(controlsObj, this.user2Options, 'toUserCode', 'eCode', 'username');
          this.cdRef.detectChanges();
        }
      });
  }

  getShifts() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_SHIFTS, variables: { query: { limit: 100 } } }).valueChanges
      .pipe(map((data: any) => data?.data?.getShifts))
      .subscribe(val => {
        if (val) {
          this.shift1Options = _.cloneDeep(val);
          this.shift2Options = _.cloneDeep(val);
          this.cdRef.detectChanges();
        }
      });
  }

  getDepartments() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_DEPARTMENTS, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getDepartments))
      .subscribe(val => {
        if(val) {
          this.departmentOptions = val;
          this.cdRef.detectChanges();
        }
      });
  }

  onRostersGridReady(event: any) {
    this.rostersGridApi = event.gridApi;
    this.rostersGridColumnApi = event.gridColumnApi;
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'Duty Roster', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Admin', 'Duty Roster', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'Duty Roster', 'export');

    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.DutyRoster,
          filterConfig: {
            filterForm: false,
            addButton: false,
            show_Export_Button: this.hide_show_export_button,
            swapButton: true,
            addButtonText: CONSTANTS.TITLES.AddDutyRoster,
            uploadButton: this.hide_show_import_button,
            uploadText: this.hide_show_import_button && '.csv file only',
            uploadSample: this.hide_show_import_button && { text: 'Downlaod Feb-ROSTER-HR.csv', url: '/assets/Feb-ROSTER-HR.csv' },
            confirmDutyRoster: true
          },
          compData: this.multiChartData,
          gridComponentFullHeight: true,
          flexStart: true,
          gridHeaderTemplate: this.gridHeaderTemplate,
          updateMultiChart: this.updateMultiComp$
        },
        flatItem: false,
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        }
      }
    ];
  }

  outputActions(event: any) {
    console.log(event);
  }

  dynamicCompClickHandler(event: any) {
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.gridApi = event.gridApi;
        this.columnApi = event.gridColumnApi;
      }
    }
    if (event.component && event.comp_name === CONSTANTS.IHRMS_MULTI_CHART_COMPONENT) {
      if (event.action === CONSTANTS.ROSTER_CONFIRM) {
        console.log(CONSTANTS.ROSTER_CONFIRM);
        // Upload API Goes Here then inside call this.getDutyRosters();
      }

    }
    if (event.action === CONSTANTS.UPLOAD_ANY) {
      if (event.uploadOutput.type === 'addedToQueue') {
        console.log(event);
        this.startUpload(event.uploadOutput);
      }
    }
    if (event.action === CONSTANTS.FILTER_SWAP_DUTY) {

      const fetchControls = this._adrstrs.getDynamicControls();

      const dialogRef = this.dialog.open(IhrmsDialogComponent, {
        data: {
          title: 'Swap/Change Shifts',
          controls: fetchControls,
          formConfig: {
            okButtonText: 'Save Changes',
            flexAlignStart: true,
            flexGap: '5',
            // patchValue: patchValue,
            // readOnly: readOnly,
            //  action: action,
            closeFromOutside: true
          }
        },
        panelClass: 'ihrms-dialog-overlay-panel',
      });

      dialogRef.componentInstance.dialogEventEmitter.subscribe((result: any) => {
        if (result) {

          if (result.action === CONSTANTS.FORM_OBJECT_EVENT) {
            this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.shift1Options, 'fromShift', 'name');
            this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.shift2Options, 'toShift', 'name');
            this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, this.departmentOptions, 'department', '_id');
          }

          if (result.action === CONSTANTS.FORM_VALUE_CHANGE) {

            if (result.value.department) {
              if(!this.user1Options?.length && !this.user2Options?.length) {
                this.getUsersByDepartmets(result.value.department, dialogRef.componentInstance?.controlsObj);
              }
            }
            
            if (result.value.fromUsereCode) {
              const isExist = this.user2Options.filter((user: any) => user.eCode !== result.value.fromUsereCode);
              this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, isExist, 'toUserCode', 'eCode', 'username');
            }

            if (result.value.fromShift) {
              const isExist = this.shift2Options.filter((shift: any) => shift.name !== result.value.fromShift);
              this._ihrmsadss.getSelectOptions(dialogRef.componentInstance?.controlsObj, isExist, 'toShift', 'name');
            }

            if (result.value.action === 'change') {
              dialogRef.componentInstance?.form?.controls["toUserCode"].clearValidators();
              dialogRef.componentInstance?.form?.controls["toShift"].clearValidators();
              this._ihrmsadss.updateSelectedControl(dialogRef.componentInstance?.controlsObj, 'toUserCode', 'controlType', 'hidden');
              // this._ihrmsadss.updateSelectedControl(dialogRef.componentInstance?.controlsObj, 'toShift', 'controlType', 'hidden');
            } else {
              this._ihrmsadss.updateSelectedControl(dialogRef.componentInstance?.controlsObj, 'toUserCode', 'controlType', 'dropdown');
              // this._ihrmsadss.updateSelectedControl(dialogRef.componentInstance?.controlsObj, 'toShift', 'controlType', 'dropdown');
              dialogRef.componentInstance?.form?.controls["toUserCode"].addValidators([Validators.required]);
              dialogRef.componentInstance?.form?.controls["toShift"].addValidators([Validators.required]);
            }
          }

          if (result.action === CONSTANTS.FORM_SUBMIT_EVENT) {
            const month = moment(result.value.date).startOf('month').utcOffset(0);
            month.set({hour:0,minute:0,second:0,millisecond:0}).add(1, 'day');

            const date = moment(result.value.date).utcOffset(0);
            date.set({hour:0,minute:0,second:0,millisecond:0}).add(1, 'day');

            const payload = {
              ...result.value,
              month,
              date,
              department: this.departmentOptions.filter((depart: any) => depart._id === result.value.department)[0]?.name
            }
            this.apollo.mutate({ mutation: GQL_SWAP_SHIFT, variables: payload })
              .pipe(map((res: any) => res?.data.shiftSwapRequest))
              .subscribe((val: any) => {
                if (val) {
                  // this.rowIndexOrID.next({ data: val, action: CONSTANTS.ADD });
                  this.toastrService.success(`Success`, `Data Added Successfully!`, {});
                  dialogRef.close();
                }
              });
          }

        }
      })
    }
  }

  openDialog(): any {
    return this.dialog.open(this.confirmDialog, {
      panelClass: ['ihrms-dialog-overlay-panel', 'confirm-dialog-panel'],
    });
  }

  updateColDefAndRowData(response: any) {
    this.multiChartData[0].gridData.columnDefs = [{ field: 'month', cellRenderer: (data: any) => moment(data.value).format('MMMM-YYYY') }, { field: 'eCode' }, { field: 'username' }];
    response[0].dateRange.forEach((date: any) => this.multiChartData[0].gridData.columnDefs.push(
      { 
        field: moment(date.date).format('DD-MMM-YY'),
        editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
            values: this.shift1Options,
            cellRenderer: 'RichSelectCellRendererComponent',
            searchDebounceDelay: 500
        },
        cellRenderer: (data: any) => {
          // const shift = this.shift1Options.find((shift: any) => shift._id == data.value || shift.name == data.value);
          return data.value?.name || data.value;
        },
      }
    ));

    _.forEach(response, (user, idx) => _.forEach(user.dateRange, (d, ijx) => response[idx][moment(d.date).format('DD-MMM-YY')] = d.shifts));
    this.rowIndexOrID.next({ columnDefs: this.multiChartData[0].gridData.columnDefs, action: CONSTANTS.UPDATE, rowData: response });
  }

  // Upload
  startUpload(uploadOutput: UploadOutput) {
    // You will get Single File Always || Single Enable
    this.apollo.mutate({
      mutation: GQL_ROSTER_UPLOAD,
      variables: { file: uploadOutput.file?.nativeFile }
    })
      .pipe(map((res: any) => res?.data.uploadFileRoster))
      .subscribe((val: any) => {
        const response = _.cloneDeep(val);
        this.updateColDefAndRowData(response);
      });

  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}
