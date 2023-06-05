/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { GQL_ALL_EMPLOYEES, GQL_EMPLOYEES, MultiChartsComponent, MyProfileComponent } from '@ihrms/ihrms-components';
import { CONSTANTS, IhrmsDashboardItem, printDiv } from '@ihrms/shared';
import { AdminEmployeesService, GQL_EMPLOYEE_UPLOAD,GQL_UPLOAD_EMPLOYEE_DETAILS } from './_services/admin-employees.service';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../_services/ihrms-admin-dashboard.service';
import * as moment from 'moment';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { UploadFile, UploadInput, UploadOutput } from 'ngx-uploader';
import { GridApi } from 'ag-grid-community';
import { ColumnApi } from '@ag-grid-community/core';
import { SharedService } from '@ihrms/shared';

@Component({
  selector: 'ihrms-admin-employees',
  templateUrl: './admin-employees.component.html',
  styleUrls: ['./admin-employees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminEmployeesComponent implements OnInit, AfterViewInit, OnDestroy {

  highcharts: typeof Highcharts = Highcharts;
  gridsterOptions: GridsterConfig;
  cardSize = 500;
  gridLoaded = false;
  dashboardItems!: Array<IhrmsDashboardItem>;
  gridResize: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  multiChartData: any | undefined;

  employeeDetailsArray: any;

  hide_show_add_button: any;

  hide_show_edit_button: any;

  hide_show_import_button: any;

  hide_show_export_button: any;

  sub!: Subscription;

  rowIndexOrID: Subject<any> = new Subject();

  // Upload
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  fileToUpload!: File;

  // Pre Upload Handling
  @ViewChild('preUploadDialog', { static: true }) preUploadDialog!: TemplateRef<any>;
  preUploadData: any | undefined;

  preUploadGridApi1!: GridApi;
  preUploadGridApi2!: GridApi;
  preUploadGridApi3!: GridApi;

  preUploadRowCurrentSelected!: number;
  
  employeeGridApi!: GridApi;
  employeeColumnApi!: ColumnApi;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _aes: AdminEmployeesService,
    private router: Router,
    public dialog: MatDialog,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private sharedService: SharedService
  ) {
    this.gridsterOptions = this._aes.getGridsterOptions(this.cardSize, this);
  }

  ngOnInit(): void {
    this.hide_show_edit_button = this.sharedService.checkuserPermission('Admin', 'All Employees', 'edit');
    this.multiChartData = [
      {
        title: "",
        pagination: true,
        paginationAutoPageSize: true,
        viewAll: false,
        gridData: {
          columnDefs: [
            { headerName: 'Name', field: 'name' }, // cellRenderer: (node: any) => node.data.name + '&nbsp;' + node.data.surname
            { headerName: 'ECode', field: 'eCode' },
            // { headerName: 'Email', field: 'email', wrapText: false, width: 300}, // Email is Username currently
            { headerName: 'Username', field: 'username', wrapText: false, filter: 'agTextColumnFilter'},
            { headerName: 'Designation', field: 'designation.name', wrapText: false, pivot: true, },
            { headerName: 'Department', field: 'unitDepartment.name', wrapText: false, pivot: true },
            { headerName: 'Manager', field: 'reportingManager.username', wrapText: false, pivot: true },
            // { headerName: 'Shift', field: 'employeeShifts', wrapText: false, cellRenderer: 'GridSimpleListComponent', autoHeight: true,},
            { headerName: 'Role', field: 'role.role_name'},
            { headerName: 'DOJ', field: 'doj', wrapText: false, width: 250, cellRenderer: (data: any) => data.value && this.getCurrentZoneTime(data.value) },
            { headerName: 'Employment Type', field: 'employeeType.name', wrapText: false},
            { headerName: 'Bank Name', field: 'bankName'},
            { headerName: 'Account No.', field: 'accountNo'},
            { headerName: 'Blood Group', field: 'bloodGroup'},
            { headerName: 'Status', field: 'status', cellRenderer: 'GridStatusComponent' },
            { field: 'Action', filter: false, cellRenderer: 'GridActionComponent',
              cellRendererParams: {
                action: this.outputActions.bind(this),
                value: { actionBtn: [ 'edit' ] }
              },
              hide: !this.hide_show_edit_button
            },
          ],
          rowData: [],
          updateGridFromOutside: this.rowIndexOrID
        },
        flex: 100,
        height: 100,
        mobileFlexInPx: 500
      }
    ]

    const cellClassRules = {
      "cell-fail": (params: any) => !params.value
    };

    this.preUploadData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 5,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'eCode', cellClassRules: cellClassRules }, // , headerCheckboxSelection: true, checkboxSelection: true,
          { field: 'username', cellClassRules: cellClassRules },
        ],
        rowData: [],
      },
      flex: 100
    };

    this.setupDashboardItems();

    this.getEmployees();

  }

  ngAfterViewInit() {
    this.gridLoaded = true;
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  getCurrentZoneTime(d: any) {
    return moment(d).format('MM/DD/YYYY');
  }

  getEmployees() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_EMPLOYEES, variables: { query: { 
      limit: 1000,
      approvers:  [{
        approverID: JSON.parse(sessionStorage.getItem('auth-user') || '').userID,
      }],
    }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getUsers))
      .subscribe(val => {
        if(val) {
          this.multiChartData[0].gridData.rowData = val;
          this.rowIndexOrID.next({ action: CONSTANTS.UPDATE, rowData: val });
          this.cdRef.detectChanges();
        }
      });
  }

  outputActions(event: any) {
    console.log(event)
    if(event.action === CONSTANTS.EDIT ) {
      const dialogRef = this.dialog.open(MyProfileComponent, {
        data: {
          // title: title,
          // controls: fetchControls,
          editProfile: true,
          formConfig: {
            okButtonText: 'Save Changes',
            patchValue: event?.params?.data,
            // readOnly: false,
            action: event.action,
            // flex: 32,
            closeFromOutside: true
          }
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if(result) {
          console.log(result);
        }
      });

    }
    if(event.action === CONSTANTS.VISIBILITY ) {
      //
    }
    if(event.action === CONSTANTS.CANCEL ) {
      //
    }
  }

  setupDashboardItems() {
    this.hide_show_add_button = this.sharedService.checkuserPermission('Admin', 'All Employees', 'add');
    this.hide_show_import_button = this.sharedService.checkuserPermission('Admin', 'All Employees', 'import');
    this.hide_show_export_button = this.sharedService.checkuserPermission('Admin', 'All Employees', 'export');
    this.dashboardItems = [
      {
        dynamicComponent: MultiChartsComponent,
        gridsterItem: { cols: 2, rows: 2, y: 0, x: 0 },
        inputs: {
          cardRadius: 20,
          title: CONSTANTS.TITLES.Employees,
          filterConfig: {
            filterForm: false,
            show_Export_Button: this.hide_show_export_button,
            addButton: this.hide_show_add_button,
            addButtonText: CONSTANTS.TITLES.AddEmployee,
            uploadButton: this.hide_show_import_button,
            uploadText: this.hide_show_import_button && '.csv file only',
            uploadSample: this.hide_show_import_button && { text: 'Downlaod users-sample.xlsx', url: '/assets/users-sample.xlsx' }
          },
          compData: this.multiChartData,
          gridComponentFullHeight: true,
          isMobileFullHeight: true
          // updateMultiChart: this.updateMultiChartFromOutside$,
        },
        outputs: {
          onClickHandler: { handler: this.dynamicCompClickHandler.bind(this), args: ['$event'] }
        },
      }
    ];
  }

  dynamicCompClickHandler(event: any) {
    console.log(event)
    if(event.component && event.comp_name === CONSTANTS.IHRMS_FILTERS_COMPONENT) {
      if(event.action === CONSTANTS.ADD_ANY && event.text === CONSTANTS.TITLES.AddEmployee) {
        this.router.navigateByUrl(`${CONSTANTS.ADMIN_DASHBOARD}/${CONSTANTS.CREATE_PROFILE}`)
      }
      if(event.action === CONSTANTS.UPLOAD_ANY) {
        if(event.uploadOutput.type === 'addedToQueue') {
          console.log(event);
          this.startUpload(event.uploadOutput);
        }
      }
      if(event.action === CONSTANTS.EXPORT_TO_EXCEL) {
        this.employeeGridApi.exportDataAsExcel({
          fileName: 'All_Employees_.xlsx'
        });
      }
      if(event.action === CONSTANTS.PRINT_ONLY) {
        const eGridDiv = document.querySelector<HTMLElement>('#ihrmsGrid') as any;
        eGridDiv.style.width = '';
        eGridDiv.style.height = '';
        this.employeeGridApi.setDomLayout('print');
        setTimeout(function () {
          print();
        }, 2000);
        // printDiv('ihrmsGrid');
      }
    }
    
    if (event.component && event.comp_name === CONSTANTS.IHRMS_GRID_COMPONENT) {
      if (event.action === CONSTANTS.ON_GRID_READY) {
        this.employeeGridApi = event.gridApi;
        this.employeeColumnApi = event.gridColumnApi;
      }
    }
  }

  // Upload
  startUpload(uploadOutput: UploadOutput) {
    // You will get Single File Always || Single Enable
    this.apollo.mutate({ 
        mutation: GQL_EMPLOYEE_UPLOAD, 
        variables: { file: uploadOutput.file?.nativeFile }
      })
      .pipe(map((res: any) => res?.data.uploadFile[0]))
      .subscribe((val: any) => {
        console.log(val);
        this.employeeDetailsArray = val.employees;
        if(val) this.openPreUploadDialog(this.preUploadDialog, val);
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


  UploadUser(event: any) {
    this.apollo.mutate({ mutation: GQL_UPLOAD_EMPLOYEE_DETAILS, variables: { input:this.employeeDetailsArray} })
    .pipe(map((res: any) => res?.data.insertManyUsers))
    .subscribe((val: any) => {
      if(val) {
        this.getEmployees();
        this.dialog.closeAll();
        this.toastrService.success( `Success`, `Data Upload Successfully!`, { } );

      }
    });
    
  }

  openPreUploadDialog(templateRef: TemplateRef<any>, data: { dups: any[], invalids: any[], employees: any[], DBUsers: [] }) {
    this.dialog.open(templateRef, { data, minWidth: '80vw', disableClose: true })
    .afterClosed().subscribe((val: boolean) => {
      let gridSelectedRows: any = [];
      if(this.preUploadGridApi1) {
        gridSelectedRows = [
          ...this.preUploadGridApi1.getSelectedRows(),
        ];
      }
      if(this.preUploadGridApi1 && this.preUploadGridApi2) {
        gridSelectedRows = [
          ...this.preUploadGridApi1.getSelectedRows(),
          ...this.preUploadGridApi2.getSelectedRows(),
        ];
      }
      if(this.preUploadGridApi1 && this.preUploadGridApi2 && this.preUploadGridApi3) {
        gridSelectedRows = [
          ...this.preUploadGridApi1.getSelectedRows(),
          ...this.preUploadGridApi2.getSelectedRows(),
          ...this.preUploadGridApi3.getSelectedRows(),
        ];
      }
    })
  }

  preUploadGridReady(event: any, idx: number) {
    idx === 0 && (this.preUploadGridApi1 = event.gridApi); // Records already exists in Database
    idx === 1 && (this.preUploadGridApi2 = event.gridApi); // Duplicate Records
    idx === 3 && (this.preUploadGridApi3 = event.gridApi); // Records with missing data
  }

  getRows(rows: any) {
    return rows;
  }
  

}
