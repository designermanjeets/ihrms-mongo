import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ControlBase } from '@ihrms/ihrms-dynamic-forms';
import { AdminSettingsService, GQL_CREATE_LEAVE_TYPE, GQL_EDIT_LEAVE_TYPE, GQL_LEAVE_TYPES } from '../_services/admin-settings.service';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { CONSTANTS } from '@ihrms/shared';
import { elementAt, map } from 'rxjs/operators';
import { IhrmsAdminDashboardService } from '../../_services/ihrms-admin-dashboard.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { disableDebugTools } from '@angular/platform-browser';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'ihrms-leave-settings',
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveSettingsComponent implements OnInit, AfterViewInit {

  selectedIndex = 0;

  formLeaveSettings!: FormGroup;
  leaveSettingsControls$!: Observable<ControlBase<any>[]>;
  formLeaveSettingsSubmit$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  formInvalidControls$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  leaveTypesData: any | undefined;
  leaveTypeBtnText = CONSTANTS.ADD;
  leaveTypesGridApi!: GridApi;
  leaveTypesGridColumnApi!: ColumnApi;
  leaveTypeRowCurrentSelected!: number;
  leaveTypeRowIndexOrID: Subject<any> = new Subject();

  constructor(
    private cdRef: ChangeDetectorRef,
    private _adss: AdminSettingsService,
    private _ihrmsadss: IhrmsAdminDashboardService,
    private apollo: Apollo,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {

    this.leaveSettingsControls$ = this._adss.getLeaveSettingsControls();

    this.leaveTypesData = {
      title: '',
      pagination: true,
      columnFit: true,
      paginationPageSize: 10,
      viewAll: false,
      gridData: {
        columnDefs: [
          { field: 'name' },
          { field: 'days' },
          { field: 'carryForward', cellRenderer: 'GridCheckBoxComponent' },
          { field: 'carryForwardDays' },
          { field: 'comments' },
          { field: 'CustomPolicy' },
          {
            field: 'Action', cellRenderer: 'GridActionComponent',
            cellRendererParams: {
              action: this.outputLeaveTypesActions.bind(this),
              value: { actionBtn: ['edit'] }
              
            
            }
          }
        ],
        rowData: [],
        updateGridFromOutside: this.leaveTypeRowIndexOrID,
      },
      flex: 100
    };

    this.getLeaveTypes();

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  getLeaveTypes() {
    this.apollo.watchQuery<any, any>({ query: GQL_LEAVE_TYPES, variables: { query: { limit: 100 }}}).valueChanges
      .pipe(map((data: any) => data?.data?.getLeaveTypes))
      .subscribe(val => this.leaveTypesData.gridData.rowData = val);
      
      
  }
  // Leave Form
  leaveSettingsFormSubmitEvent(event: any) {
    if(this.leaveTypeBtnText === CONSTANTS.EDIT) {
      // this._ihrmsadss.updateEntity(CONSTANTS.TITLES.Leave, event)
      event.days = Number(event.days)
      this.apollo.mutate({ mutation: GQL_EDIT_LEAVE_TYPE, variables: event, })
        .pipe(map((data: any) => data?.data.editLeaveType))
        .subscribe(val => {
          if(val) {
            this.leaveTypeRowIndexOrID.next({rowIndex: this.leaveTypeRowCurrentSelected, data: val, action: CONSTANTS.EDIT});
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
          }
        }, (error: any) => {
          if(error) {
            const err = error.error.error.validationErrors;
            console.log(err)
            for (const valueElement of err.value) {
              const control = this.formLeaveSettings && this.formLeaveSettings.get(valueElement.members[0]);
              this.formInvalidControls$.next(control);
            }
          }
        });
    }
    if(this.leaveTypeBtnText === CONSTANTS.ADD) {
      delete event.id;
      event.days = Number(event.days);
      event.carryForwardDays = Number(event.carryForwardDays);

      this.apollo.mutate({ mutation: GQL_CREATE_LEAVE_TYPE, variables: event, })
        .pipe(map((data: any) => data?.data.createLeaveType))
        .subscribe(val => {
          if(val) {
            this.leaveTypeRowIndexOrID.next({rowIndex: this.leaveTypeRowCurrentSelected, data: val, action: CONSTANTS.ADD});
            this.toastrService.success( `Success`, `Data Updated Successfully!`, { } );
          }
        }, (error: any) => {
          if(error) {
            const err = error.error.error.validationErrors;
            for (const valueElement of err.value) {
              const control = this.formLeaveSettings && this.formLeaveSettings.get(valueElement.members[0]);
              this.formInvalidControls$.next(control);
              
            }
          }
        });
    }
    
    this.leaveTypeBtnText = CONSTANTS.ADD;
    this.formLeaveSettings.reset();
  }

  leaveSettingsFormObjectEvent(form: FormGroup) {
    this.formLeaveSettings = form;

    this.formLeaveSettings.valueChanges.subscribe(val => {
      if(!val.carryForward) {
        this.formLeaveSettings.get('carryForwardDays')?.disable({ emitEvent: false});
      } else {
        this.formLeaveSettings.get('carryForwardDays')?.enable({ emitEvent: false});
      }
    })
  }
    
  onLeaveSettingsSaveEvent(event: any) {
    this.formLeaveSettingsSubmit$.next(true);
  } 

  onLeaveTypesGridReady(event: any) {
    this.leaveTypesGridApi = event.gridApi;
    this.leaveTypesGridColumnApi = event.gridColumnApi;
  }

  outputLeaveTypesActions(event: any) {
    if (event.action === CONSTANTS.EDIT) {
      const fData = event.params.data;
      this.formLeaveSettings.patchValue(fData);
      this.leaveTypeBtnText = CONSTANTS.EDIT;
      this.leaveTypeRowCurrentSelected = event.params.rowIndex;
    }
    if (event.action === CONSTANTS.CANCEL) {
      this._ihrmsadss.deleteEntity(CONSTANTS.TITLES.Leave, event.params.data.id)
        .pipe(map((data: any) => data))
        .subscribe((val: any) => {
          if(val?.success) {
            this.leaveTypesGridApi.applyTransaction({ remove: [event.params.data] });
          }
        });
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}
