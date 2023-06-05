import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminSettingsService, GQL_CREATE_ROLE, GQL_EDIT_ROLE, GQL_ROLES } from '../_services/admin-settings.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, Subject, Subscription } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { CONSTANTS } from '@ihrms/shared';
import { ColumnApi, GridApi, GridOptions, RowNode } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { roleData } from './role.static-data';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import * as _ from 'lodash';
import { Role } from '@ihrms/auth';

@Component({
  selector: 'ihrms-role-privileges-settings',
  templateUrl: './role-privileges-settings.component.html',
  styleUrls: ['./role-privileges-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolePrivilegesSettingsComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formRole!: FormGroup;
  roleControls$!: Observable<ControlBase<any>[]>;
  formRoleSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  rolesData: any | undefined;
  roleBtnText = CONSTANTS.ADD;
  rolesGridApi!: GridApi;
  rolesGridColumnApi!: ColumnApi;
  roleRowCurrentSelected!: number;
  roleRowIndexOrID: Subject<any> = new Subject();

  formPermission!: FormGroup;
  permissionControls$!: Observable<ControlBase<any>[]>;
  permissionControlsObj!: any;
  formPermissionSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  permissionsData: any | undefined;
  permissionBtnText = CONSTANTS.ADD;
  permissionsGridApi!: GridApi;
  permissionsGridColumnApi!: ColumnApi;
  permissionsGridOptions!: GridOptions;
  permissionRowCurrentSelected!: number;
  permissionRowIndexOrID: Subject<any> = new Subject();

  roleOptions: any;

  sub!: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService,
    private http: HttpClient,
    private apollo: Apollo,
    private toastrService: ToastrService,
    private _ihrmsadss: IhrmsAdminDashboardService,
  ) {
  }

  ngOnInit(): void {
    this.roleControls$ = this._adss.getRoleControls();

    this.rolesData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'role_name', headerName: 'Name' },
          { field: 'isDefault', cellRenderer: (data: any) => (data.value?.toString())?.toUpperCase() },
          { field: 'status', cellRenderer: 'GridStatusComponent' },
          { field: 'comments' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputRoleActions.bind(this),
              value: { actionBtn: ['edit'] }
            }
          }
        ],
        rowData: [ ],
        updateGridFromOutside: this.roleRowIndexOrID,
      },
      flex: 100
    };

    this.permissionControls$ = this._adss.getPermissionControls();
    this.sub = this.permissionControls$.subscribe((cntrls: ControlBase<any>[]) => this.permissionControlsObj = cntrls);

    this.permissionsData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'module', rowGroup: true, enableRowGroup: true, hide: true, autoHeight: true },
          { field: 'sub_module' },
          { field: 'iconName',hide: true },
          { field: 'url',hide: true },
          { field: 'isChild', hide: true},
          { field: 'show', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'add', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'edit', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'delete', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'authorize', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'cancel', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'import', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
          { field: 'export', cellRenderer: 'GridCheckBoxComponent', cellRendererParams: { action: this.outputActions.bind(this), data: { readOnly: false } } },
        ],
        rowData: [],
        updateGridFromOutside: this.permissionRowIndexOrID,
      },
      flex: 100
    };

    this.getRoles();

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getRoles() {
    this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getRoles))
      .subscribe(val => {
        val = val.filter((res: any) => res.role_name !== Role.Admin.toUpperCase());
        this.roleOptions = val;
        this.roleRowIndexOrID.next({rowData: val, action: CONSTANTS.UPDATE});
      });
  }

  onCellClicked(event: any) {
    console.log(event);
  }

  outputActions(event: any) {
    if(event.action === CONSTANTS.CHECKBOX_CHANGED) {
      if(event?.checked) { // If Checked
        console.log('checked',event.data.data);
        if(event?.data?.node?.group) {
          const colId = event?.data?.column?.colId;
          const allChild: RowNode[] = event?.data?.node?.allLeafChildren;
          this.permissionsGridApi.clearRangeSelection();
          this.permissionsGridApi.addCellRange({
            rowStartIndex: event?.data?.node?.rowIndex,
            rowEndIndex: event?.data?.node?.rowIndex + event?.data?.node?.allChildrenCount,
            columnStart: colId,
            columnEnd: colId,
          });
          allChild?.forEach((row: RowNode) => row.setDataValue(colId, true)); // Check all Checkboxes of that column
          event.data.node.setDataValue(colId, true);
        } else {
          event.data.node.setDataValue(event?.data?.column?.colId, true);
          const allChild: RowNode[] = event?.parent?.allLeafChildren;
          const allChecked = allChild?.some((row: RowNode) => !row.data[event?.data?.column?.colId]);
          !allChecked && event?.parent?.setDataValue(event?.data?.column?.colId, true);
        }
      } else {
        if(event?.data?.node?.group) {
          this.permissionsGridApi.clearRangeSelection();
          const allChild: RowNode[] = event?.data?.node?.allLeafChildren;
          allChild?.forEach(row => row.setDataValue(event?.data?.column?.colId, false)); // Un-Check all Checkboxes of that column
          event.data.node.setDataValue(event?.data?.column?.colId, false);
        } else {
          event.data.data[event.data.column.colId] = false;
          event?.parent?.setDataValue(event?.data?.column?.colId, false);
        }
      }
    }
  }

  getColumnIndexByColId(api: ColumnApi, colId: string): number | undefined {
    return api.getAllColumns()?.findIndex(col => col.getColId() === colId);
  }

  formRoleSubmitEvent(event: any) {
    if(this.roleBtnText === CONSTANTS.EDIT) {
      this.apollo.mutate({ mutation: GQL_EDIT_ROLE, variables: event })
        .pipe(map((data: any) => data?.data?.editRole))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
            this.roleRowIndexOrID.next({ rowIndex: this.roleRowCurrentSelected,  data: val, action: CONSTANTS.EDIT });
          }
        });
    }
    if(this.roleBtnText === CONSTANTS.ADD) {
      delete event._id;
      this.apollo.mutate({ mutation: GQL_CREATE_ROLE, variables: event })
        .pipe(map((data: any) => data?.data?.createRole))
        .subscribe(val => {
          if(val) {
            this.toastrService.success( `Success`, `Data Added Successfully!`, { } );
            this.roleRowIndexOrID.next({ data: val, action: CONSTANTS.ADD });
            this.getRoles();
          }
        });
    }

    this.roleBtnText = CONSTANTS.ADD;
    this.formRole.reset();
  }

  formRoleObjectEvent(form: FormGroup) {
    this.formRole = form;
  }

  onRoleAddEvent(event: any) {
    this.formRoleSubmit$.next(true);
  }

  onRoleGridReady(event: any) {
    this.rolesGridApi = event.gridApi;
    this.rolesGridColumnApi = event.gridColumnApi;
  }

  outputRoleActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formRole.patchValue(fData);
      this.roleBtnText = CONSTANTS.EDIT;
      this.roleRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      // Delete
    }
  }

  formPermissionSubmitEvent(event: any) {
    console.log(this.permissionsData.gridData.rowData)
    const modulez = _(this.permissionsData.gridData.rowData)
    .groupBy('module')
    .map(g => ({
      name: g[0].module, 
      sub_module: _.map(g, ({employee, ...rest}, idx) => ({
        db: null,
        name: g[idx].sub_module,
         iconName: g[idx].iconName,
         url: g[idx].url,
         isChild: g[idx].isChild,
        actions:  _.omit(g[idx], ['module', 'readOnly', 'sub_module', 'iconName','url','isChild'])
      })),
      iconName: g[0].iconName,
      url: g[0].url
    }))
    .value();

    const payload = {
      _id: event.role_name,
      role_name: this.roleOptions.filter((role: any) => role._id === event.role_name)[0]?.role_name,
      privileges: { module: modulez }
    }

    this.apollo.mutate({ mutation: GQL_EDIT_ROLE, variables: payload })
      .pipe(map((data: any) => data?.data?.editRole))
      .subscribe(val => {
        if(val) {
          this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
        }
      });
  }

  formPermissionObjectEvent(form: FormGroup) {
    this.formPermission = form;
    this._ihrmsadss.getSelectOptions(this.permissionControlsObj, this.roleOptions, 'role_name', '_id', 'role_name')
   
    this.formPermission.valueChanges.subscribe(val => {
      if(val && val.role_name) {
        this.sub = this.apollo.watchQuery<any, any>({ query: GQL_ROLES, variables: { query: { limit: 100, id: val.role_name }}}).valueChanges
        .pipe(map((data: any) => data?.data?.getRoles[0].privileges.module)) // Getting By ID so Single Always
        .subscribe(modulez => {
          const newData = [] as any;
          const roleDataClone = JSON.parse(JSON.stringify(roleData));
          modulez.forEach((mod: any) => mod.sub_module.forEach((submod: any) => newData.push(
            { 
              module: mod.name, 
              sub_module: submod.name, ...submod.actions,
              iconName: submod.iconName,
              url: submod.url,
              isChild: submod.isChild,
            }
            )));
          roleDataClone.forEach((mod: any, idx: number) => {
            const isExist = newData.filter((item: any) => item.module === mod.module && item.sub_module === mod.sub_module)[0];
            isExist && (roleDataClone[idx] = Object.assign({}, isExist))
          });
          this.permissionsData.gridData.rowData = [...roleDataClone];
          this.cdRef.detectChanges();
        });
      }
    })

  }

  getRoleByID(Id: string) {
    //
  }

  onPermissionAddEvent(event: any) {
    this.formPermissionSubmit$.next(true);
  }

  onPermissionGridReady(event: any) {
    this.permissionsData.gridData.rowData = roleData;
    this.permissionsGridApi = event.gridApi;
    this.permissionsGridColumnApi = event.gridColumnApi;
    this.permissionsGridOptions = event.gridOptions;
    this.cdRef.detectChanges();
  }

  outputPermissionActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formPermission.patchValue(fData);
      this.permissionBtnText = CONSTANTS.EDIT;
      this.permissionRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      // Delete
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
